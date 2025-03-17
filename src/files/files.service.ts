import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Are you sure file is a image?');
    }

    const secureUrl = `${file.filename}`;

    // return Promise.resolve(undefined);
    return {
      filename: secureUrl,
    };
  }

  getProductImage(imageName: string): string {
    const path = join(__dirname, '../../../static/uploads/products', imageName); // path fisico fuera del serve static de nest
    console.log(__dirname);
    if (!existsSync(path))
      throw new BadRequestException(
        `Not product found with image ${imageName}`,
      );

    return path;
  }
}
