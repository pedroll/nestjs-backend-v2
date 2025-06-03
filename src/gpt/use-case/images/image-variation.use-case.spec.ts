import { InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';
import * as fs from 'node:fs';
// Import the mocked module
import { saveImageToFs } from '../../helpers';

// Import the module under test after mocking dependencies
import { imageVariationUseCase } from './image-variation.use-case';

// Mock the helpers module
jest.mock('../../helpers', () => ({
  saveImageToFs: jest.fn(),
}));

// Mock the ConfigService
jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => ({
    get: jest.fn().mockReturnValue('https://api.example.com'),
  })),
}));

describe('imageVariationUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  // Successfully creates an image variation with valid base image URL
  it('should create an image variation with a valid base image URL', async () => {
    // Arrange
    const mockOpenAi = {
      images: {
        createVariation: jest.fn().mockResolvedValue({
          data: [{ url: 'https://example.com/generated-image.png' }],
        }),
      },
    } as unknown as OpenAI;

    const mockOptions = {
      baseImage: 'https://example.com/base-image.png',
    };

    const mockImagePath = '/path/to/downloaded/image.png';
    const mockReadStream = { pipe: jest.fn() };

    jest.spyOn(fs, 'createReadStream').mockReturnValue(mockReadStream as any);

    // Mock saveImageToFs to return different values on different calls
    (saveImageToFs as jest.Mock).mockResolvedValueOnce(mockImagePath);
    (saveImageToFs as jest.Mock).mockResolvedValueOnce('generated-image.png');

    // Act
    const result = await imageVariationUseCase(mockOpenAi, mockOptions);

    // Assert
    expect(saveImageToFs).toHaveBeenCalledWith(
      'https://example.com/base-image.png',
      'url',
      true,
    );
    expect(fs.createReadStream).toHaveBeenCalledWith(mockImagePath);
    expect(mockOpenAi.images.createVariation).toHaveBeenCalledWith({
      model: 'dall-e-2',
      image: mockReadStream,
      n: 1,
      size: '1024x1024',
      response_format: 'url',
    });
    expect(saveImageToFs).toHaveBeenCalledWith(
      'https://example.com/generated-image.png',
      'url',
      false,
    );
    expect(result).toEqual({
      openaiUrl: 'https://example.com/generated-image.png',
      url: 'https://api.example.com/gpt/image-generation/generated-image',
    });
  });

  // Handles case when baseImage URL is invalid or inaccessible
  it('should throw an error when baseImage URL is invalid or inaccessible', async () => {
    // Arrange
    const mockOpenAi = {} as OpenAI;

    const mockOptions = {
      baseImage: 'https://invalid-url.com/nonexistent.png',
    };

    const mockError = new InternalServerErrorException(
      'Download image was not possible',
    );
    (saveImageToFs as jest.Mock).mockRejectedValueOnce(mockError);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    // Act & Assert
    await expect(
      imageVariationUseCase(mockOpenAi, mockOptions),
    ).rejects.toThrow('Failed to save the image variation');

    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy.mock.calls[0][0]).toBe(mockError);
  });
});
