import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Are you sure file is a image?');
    }

    // return Promise.resolve(undefined);
    return {
      filename: file.originalname,
    };
  }
}
