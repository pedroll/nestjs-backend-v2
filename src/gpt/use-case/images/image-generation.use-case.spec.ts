import { imageGenerationUseCase } from './image-generation.use-case';
import OpenAI from 'openai';
import * as fs from 'node:fs';
import { ConfigService } from '@nestjs/config';

// Mock the helpers module
jest.mock('../../helpers', () => ({
  saveImageToFs: jest.fn().mockResolvedValue('generated-image-123'),
  ModelConfigurations: {
    Dalle3: {
      model: 'dall-e-3',
      quality: 'standard',
      n: 1,
      size: '1024x1024',
      response_format: 'url',
    },
  },
}));

// Create a mock ConfigService
const mockConfigService = {
  get: jest.fn().mockReturnValue('http://api.example.com'),
} as unknown as ConfigService;

describe('imageGenerationUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  // Successfully generates an image with just a prompt using Dalle3 model
  it('should generate an image with a prompt using Dalle3 model', async () => {
    // Arrange
    const mockOpenAi = {
      images: {
        generate: jest.fn().mockResolvedValue({
          data: [
            {
              url: 'https://example.com/image.png',
              revised_prompt: 'Revised test prompt',
            },
          ],
        }),
      },
    } as unknown as OpenAI;

    const options = {
      prompt: 'Test prompt',
    };

    const mockImageName = 'generated-image-123';
    jest.spyOn(fs, 'mkdirSync').mockImplementation(() => undefined);
    jest.spyOn(fs, 'createReadStream').mockImplementation(() => null as any);
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
    } as unknown as Response);

    // Reset the mock for this test
    (mockConfigService.get as jest.Mock).mockReturnValue(
      'http://api.example.com',
    );

    // Act
    const result = await imageGenerationUseCase(mockOpenAi, options);

    // Assert
    expect(mockOpenAi.images.generate).toHaveBeenCalledWith({
      model: 'dall-e-3',
      quality: 'standard',
      n: 1,
      size: '1024x1024',
      response_format: 'url',
      prompt: 'Test prompt',
    });

    // Since the function now uses its own ConfigService instance, we can't directly test with mockConfigService
    // We should check that the result has the expected structure
    expect(result).not.toBeUndefined();
    if (result) {
      expect(result).toHaveProperty(
        'openaiUrl',
        'https://example.com/image.png',
      );
      expect(result).toHaveProperty('url');
      expect(result.url).toContain('/gpt/image-generation/generated-image-123');
      expect(result).toHaveProperty('revisedPrompt', 'Revised test prompt');
    }
  });

  // Handles case when OpenAI returns no response
  it('should return undefined when OpenAI returns no response', async () => {
    // Arrange
    const mockOpenAi = {
      images: {
        generate: jest.fn().mockResolvedValue(null),
      },
    } as unknown as OpenAI;

    const options = {
      prompt: 'Test prompt',
    };

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    // Act
    const result = await imageGenerationUseCase(mockOpenAi, options);

    // Assert
    expect(mockOpenAi.images.generate).toHaveBeenCalledWith({
      model: 'dall-e-3',
      quality: 'standard',
      n: 1,
      size: '1024x1024',
      response_format: 'url',
      prompt: 'Test prompt',
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'No image data received from OpenAI',
    );
    expect(result).toBeUndefined();

    // Cleanup
    consoleSpy.mockRestore();
  });
});
