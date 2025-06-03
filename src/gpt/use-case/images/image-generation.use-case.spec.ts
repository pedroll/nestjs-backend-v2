import OpenAI from 'openai';
// Import after mocking
import { ModelConfigurations, saveImageToFs } from '../../helpers';
import { imageGenerationUseCase } from './image-generation.use-case';

// Mock toFile function
jest.mock('openai', () => {
  const originalModule = jest.requireActual('openai');
  return {
    ...originalModule,
    toFile: jest.fn().mockResolvedValue('mock-file'),
  };
});

// Mock the ConfigService
jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => ({
    get: jest.fn().mockReturnValue('http://api.example.com'),
  })),
}));

// Mock the helpers module
jest.mock('../../helpers', () => ({
  ModelConfigurations: {
    Dalle3: {
      model: 'dall-e-3',
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url',
    },
    GptImage1: {
      model: 'dall-e-2',
      n: 1,
      size: '1024x1024',
      response_format: 'url',
    },
  },
  saveImageToFs: jest.fn().mockResolvedValue('image123.png'),
}));

// Mock fs.createReadStream
jest.mock('node:fs', () => ({
  ...jest.requireActual('node:fs'),
  createReadStream: jest.fn().mockReturnValue({ pipe: jest.fn() }),
}));

describe('imageGenerationUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  // Generate image with only prompt parameter using Dalle3 configuration
  it('should generate an image with prompt using Dalle3 configuration', async () => {
    // Arrange
    const mockOpenAi = {
      images: {
        generate: jest.fn().mockResolvedValue({
          data: [
            {
              url: 'https://example.com/image.png',
              revised_prompt: 'revised test prompt',
            },
          ],
        }),
      },
    } as unknown as OpenAI;

    const options = { prompt: 'test prompt' };

    // Configure the mock return value for this test
    (saveImageToFs as jest.Mock).mockResolvedValueOnce('image123.png');

    // Act
    const result = await imageGenerationUseCase(mockOpenAi, options);

    // Assert
    expect(mockOpenAi.images.generate).toHaveBeenCalledWith({
      ...ModelConfigurations.Dalle3,
      prompt: 'test prompt',
    });

    expect(saveImageToFs).toHaveBeenCalledWith(
      'https://example.com/image.png',
      'url',
    );

    expect(result).toEqual({
      openaiUrl: 'https://example.com/image.png',
      url: 'http://api.example.com/gpt/image-generation/image123',
      revisedPrompt: 'revised test prompt',
    });
  });

  // Handle case when OpenAI response is undefined or null
  it('should return undefined when OpenAI response is null', async () => {
    // Arrange
    const mockOpenAi = {
      images: {
        generate: jest.fn().mockResolvedValue(null),
      },
    } as unknown as OpenAI;

    const options = { prompt: 'test prompt' };

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Act
    const result = await imageGenerationUseCase(mockOpenAi, options);

    // Assert
    expect(mockOpenAi.images.generate).toHaveBeenCalledWith({
      ...ModelConfigurations.Dalle3,
      prompt: 'test prompt',
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'No image data received from OpenAI',
    );

    expect(result).toBeUndefined();

    // Cleanup
    consoleErrorSpy.mockRestore();
  });

  // Test image editing with originalImage and maskImage
  it('should edit an image when originalImage and maskImage are provided', async () => {
    // Arrange
    const mockOpenAi = {
      images: {
        edit: jest.fn().mockResolvedValue({
          data: [
            {
              url: 'https://example.com/edited-image.png',
            },
          ],
        }),
      },
    } as unknown as OpenAI;

    const options = {
      prompt: 'edit prompt',
      originalImage: 'https://example.com/original.png',
      maskImage: 'data:image/png;base64,mockBase64Data',
    };

    // Mock paths for original and mask images
    (saveImageToFs as jest.Mock)
      .mockResolvedValueOnce('/path/to/original.png') // First call for original image
      .mockResolvedValueOnce('/path/to/mask.png') // Second call for mask image
      .mockResolvedValueOnce('edited-image123.png'); // Third call for saving result

    // Act
    const result = await imageGenerationUseCase(mockOpenAi, options);

    // Assert
    expect(saveImageToFs).toHaveBeenCalledWith(
      'https://example.com/original.png',
      'url',
      true,
    );
    expect(saveImageToFs).toHaveBeenCalledWith(
      'data:image/png;base64,mockBase64Data',
      'b64',
      true,
    );
    expect(mockOpenAi.images.edit).toHaveBeenCalled();
    expect(saveImageToFs).toHaveBeenCalledWith(
      'https://example.com/edited-image.png',
      'url',
    );
    expect(result).toEqual({
      openaiUrl: 'https://example.com/edited-image.png',
      url: 'http://api.example.com/gpt/image-generation/edited-image123',
      revisedPrompt: 'edit prompt',
    });
  });

  // Test handling of base64 encoded image response
  it('should handle base64 encoded image response', async () => {
    // Arrange
    const mockOpenAi = {
      images: {
        generate: jest.fn().mockResolvedValue({
          data: [
            {
              b64_json: 'base64EncodedImageData',
              revised_prompt: 'revised test prompt',
            },
          ],
        }),
      },
    } as unknown as OpenAI;

    const options = { prompt: 'test prompt' };

    // Configure the mock return value for this test
    (saveImageToFs as jest.Mock).mockResolvedValueOnce('image123.png');

    // Act
    const result = await imageGenerationUseCase(mockOpenAi, options);

    // Assert
    expect(mockOpenAi.images.generate).toHaveBeenCalledWith({
      ...ModelConfigurations.Dalle3,
      prompt: 'test prompt',
    });

    expect(saveImageToFs).toHaveBeenCalledWith('base64EncodedImageData', 'b64');

    expect(result).toEqual({
      openaiUrl: undefined,
      url: 'http://api.example.com/gpt/image-generation/image123',
      revisedPrompt: 'revised test prompt',
    });
  });

  // Test error handling
  it('should throw an error when image generation fails', async () => {
    // Arrange
    const mockOpenAi = {
      images: {
        generate: jest.fn().mockRejectedValue(new Error('API error')),
      },
    } as unknown as OpenAI;

    const options = { prompt: 'test prompt' };

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Act & Assert
    await expect(imageGenerationUseCase(mockOpenAi, options)).rejects.toThrow(
      'Failed to save the generated image',
    );

    expect(consoleErrorSpy).toHaveBeenCalled();

    // Cleanup
    consoleErrorSpy.mockRestore();
  });
});
