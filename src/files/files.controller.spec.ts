import { FilesController } from './files.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

describe('FilesController', () => {
  let controller: FilesController;
  let filesService: FilesService;
  let mockResponse: Response;
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
});
