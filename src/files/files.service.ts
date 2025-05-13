import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  constructor(private readonly configService: ConfigService) {}

  getProductImage(imageName: string): string {
    const path = join(__dirname, '../../../static/uploads/products', imageName); // path fisico fuera del serve static de nest

    if (!existsSync(path))
      throw new BadRequestException(
        `Not product found with image ${imageName}`,
      );

    return path;
  }
}
