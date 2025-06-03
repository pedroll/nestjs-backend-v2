import * as fs from 'fs';
import * as path from 'path';
import { InternalServerErrorException } from '@nestjs/common';
import { ModelConfigurations, saveImageToFs } from './download-image-as-png';

// Mock dependencies
jest.mock('fs');
jest.mock('path');
jest.mock('sharp', () => {
  return jest.fn().mockImplementation(() => ({
    png: jest.fn().mockReturnThis(),
    ensureAlpha: jest.fn().mockReturnThis(),
    toFile: jest.fn().mockResolvedValue(undefined),
  }));
});

describe('Image Helper Functions', () => {
  // Setup for common test variables
  const mockStoragePath = '/mock/storage/path';
  const mockImageBuffer = Buffer.from('mock-image-data');
  const mockTimestamp = 1234567890;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock path.resolve to return a predictable path
    (path.resolve as jest.Mock).mockReturnValue(mockStoragePath);

    // Mock path.join to concatenate paths in a predictable way
    (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));

    // Mock Date.now() to return a consistent timestamp
    jest.spyOn(Date, 'now').mockReturnValue(mockTimestamp);

    // Mock fs.mkdirSync to do nothing
    (fs.mkdirSync as jest.Mock).mockImplementation(() => undefined);
  });

  describe('ModelConfigurations', () => {
    it('should have the correct configuration for GptImage1', () => {
      expect(ModelConfigurations.GptImage1).toEqual({
        model: 'gpt-image-1',
        prompt: '',
        quality: 'auto',
        n: 1,
        size: '1024x1024',
        background: 'transparent',
        output_format: 'png',
      });
    });

    it('should have the correct configuration for Dalle3', () => {
      expect(ModelConfigurations.Dalle3).toEqual({
        model: 'dall-e-3',
        prompt: '',
        quality: 'standard',
        n: 1,
        size: '1024x1024',
        response_format: 'url',
      });
    });

    it('should have the correct configuration for Dalle2', () => {
      expect(ModelConfigurations.Dalle2).toEqual({
        model: 'dall-e-2',
        prompt: '',
        n: 1,
        size: '512x512',
        response_format: 'url',
      });
    });
  });

  describe('saveImageToFs', () => {
    describe('fileName type', () => {
      it('should read the file and return the filename when imageType is fileName', async () => {
        const inputFileName = 'test-image.png';

        // Mock fs.readFileSync to return a buffer
        (fs.readFileSync as jest.Mock).mockReturnValue(mockImageBuffer);

        const result = await saveImageToFs(inputFileName, 'fileName');

        expect(fs.readFileSync).toHaveBeenCalledWith(inputFileName);
        expect(result).toBe(inputFileName);
      });

      it('should return the full path when fullPath is true', async () => {
        const inputFileName = 'test-image.png';
        const expectedPath = `${mockStoragePath}/${inputFileName}`;

        // Mock fs.readFileSync to return a buffer
        (fs.readFileSync as jest.Mock).mockReturnValue(mockImageBuffer);

        const result = await saveImageToFs(inputFileName, 'fileName', true);

        expect(result).toBe(expectedPath);
      });
    });

    describe('url type', () => {
      it('should download the image from URL and save it as PNG', async () => {
        const mockUrl = 'https://example.com/image.jpg';
        const expectedFileName = `${mockTimestamp}.png`;

        // Mock fetch response
        global.fetch = jest.fn().mockResolvedValue({
          ok: true,
          arrayBuffer: jest.fn().mockResolvedValue(mockImageBuffer),
        });

        const result = await saveImageToFs(mockUrl, 'url');

        expect(fetch).toHaveBeenCalledWith(mockUrl);
        // Use the imported sharp module directly
        expect(require('sharp')).toHaveBeenCalledWith(mockImageBuffer);
        expect(result).toBe(expectedFileName);
      });

      it('should throw an error if the image download fails', async () => {
        const mockUrl = 'https://example.com/image.jpg';

        // Mock fetch response for failure
        global.fetch = jest.fn().mockResolvedValue({
          ok: false,
        });

        await expect(saveImageToFs(mockUrl, 'url')).rejects.toThrow(
          InternalServerErrorException,
        );
      });
    });

    describe('b64 type', () => {
      it('should decode base64 image and save it as PNG', async () => {
        const mockBase64 = 'data:image/png;base64,SGVsbG8gV29ybGQ=';
        const expectedFileName = `${mockTimestamp}-64.png`;

        const result = await saveImageToFs(mockBase64, 'b64');

        // Use the imported sharp module directly
        expect(require('sharp')).toHaveBeenCalled();
        expect(result).toBe(expectedFileName);
      });
    });

    it('should throw an error for invalid image type', async () => {
      // @ts-ignore - Testing invalid type
      await expect(saveImageToFs('test', 'invalid')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should create the storage directory if it does not exist', async () => {
      const inputFileName = 'test-image.png';

      // Mock fs.readFileSync to return a buffer
      (fs.readFileSync as jest.Mock).mockReturnValue(mockImageBuffer);

      await saveImageToFs(inputFileName, 'fileName');

      expect(fs.mkdirSync).toHaveBeenCalledWith(mockStoragePath, {
        recursive: true,
      });
    });
  });
});
