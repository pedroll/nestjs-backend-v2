import { FilesService } from './files.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { existsSync } from 'fs';
import { BadRequestException } from '@nestjs/common';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

describe('FilesService', () => {
  let service: FilesService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilesService, ConfigService],
    }).compile();
    service = module.get<FilesService>(FilesService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the correct path if file exists', () => {
    const imageName = 'test-image.png';
    const path = join(__dirname, '../../../static/uploads/products', imageName); // path fisico fuera del serve static de nest

    (existsSync as jest.Mock).mockReturnValue(true);
    const result = service.getProductImage(imageName);

    expect(result).toBe(path);
  });

  it('should should throw BadRequestException if file does not exist', () => {
    const imageName = 'test-image.png';

    (existsSync as jest.Mock).mockReturnValue(false);
    const result = () => service.getProductImage(imageName);

    expect(result).toThrow(
      new BadRequestException(`Not product found with image ${imageName}`),
    );
  });
});
