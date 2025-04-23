import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  constructor(private readonly configService: ConfigService) {}

  uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Are you sure file is a image?');
    }

    const hostApi = this.configService.get<string>('HOST_API');
    const port = this.configService.get<string>('PORT');
    const globalPrefix = this.configService.get<string>('GLOBAL_PREFIX');
    const secureUrl = `${hostApi}:${port}/${globalPrefix}/files/product/${file.filename}`;

    // return Promise.resolve(undefined);
    return { secureUrl };
  }

  getProductImage(imageName: string): string {
    const path = join(__dirname, '../../../static/uploads/products', imageName); // path fisico fuera del serve static de nest

    if (!existsSync(path))
      throw new BadRequestException(
        `Not product found with image ${imageName}`,
      );

    return path;
  }
}
