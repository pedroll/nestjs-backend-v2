import { FilesController } from './files.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { ConfigModule } from '@nestjs/config';

describe('FilesController', () => {
  let controller: FilesController;
  let fileservice: FilesService;
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
          provide: ConfigModule,
          useValue: mockConfigService,
        },
      ],
      imports: [ConfigModule],
    }).compile();

    controller = module.get<FilesController>(FilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return file path when getProductImage is called', async () => {});
});
