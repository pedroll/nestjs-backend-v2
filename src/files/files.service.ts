import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  uploadFile(file: Express.Multer.File) {
    // return Promise.resolve(undefined);
    return 'uploaded!!!';
  }
}
