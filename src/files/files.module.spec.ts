import { Test, TestingModule } from '@nestjs/testing';
import { FilesModule } from './files.module';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

describe('FilesModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [FilesModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have a FilesController', () => {
    const controller = module.get<FilesController>(FilesController);
    expect(controller).toBeDefined();
  });

  it('should have a FilesService', () => {
    const service = module.get<FilesService>(FilesService);
    expect(service).toBeDefined();
  });
});
