import { FilesController } from './files.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { BadRequestException } from '@nestjs/common';

describe('FilesController', () => {
  let controller: FilesController;
  let filesService: FilesService;

  beforeEach(async () => {
    const mockFilesService = {
      getProductImage: jest.fn(),
    };
    const mockConfigService = {
      get: jest.fn().mockReturnValue('http://localhost:3000'),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: FilesService,
          useValue: mockFilesService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<FilesController>(FilesController);
    filesService = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return file path when findProductImage is called', () => {
    const mockResponse = {
      sendFile: jest.fn(),
    } as unknown as Response;
    const imageName = 'test-image.jpg';
    const filePath = `/static/products/${imageName}`;

    jest.spyOn(filesService, 'getProductImage').mockReturnValue(filePath);

    controller.findProductImage(mockResponse, imageName);

    expect(mockResponse.sendFile).toHaveBeenCalled();
    expect(mockResponse.sendFile).toHaveBeenCalledWith(filePath);
  });

  it('should return secureUr when upload image is called with a file', () => {
    const file = {
      file: 'test-image.jpg',
      filename: 'testImageName.jpg',
    } as unknown as Express.Multer.File;

    const result = controller.uploadFile(file);

    expect(result).toEqual({
      secureUrl: 'http://localhost:3000/files/product/testImageName.jpg',
      fileName: 'testImageName.jpg',
    });
  });

  it('should should throw error if no file', () => {
    // @ts-expect-error for testing
    expect(() => controller.uploadFile(null)).toThrow(
      new BadRequestException('Make sure that the file is an image'),
    );
  });
});
