import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express'; // Import Response from express
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from './helpers/imageFilter.helper';
import { diskStorage } from 'multer';
import { imageRenamer } from './helpers/imageRenamer.helper';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('product/:imageName')
  getProductImage(
    @Res() res: Response, // hacemos override de la response de nest para servir la image en lugar del absolute path
    @Param('imageName') imageName: string,
  ): void {
    const path = this.filesService.getProductImage(imageName);
    res.sendFile(path);
  }

  //upload files
  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFileFilter,
      limits: { fileSize: 1024 * 1024 },
      storage: diskStorage({
        // todo: for security best practices must be stored in separate filesystem, bucket, cdn
        destination: './static/uploads/products',
        filename: imageRenamer,
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.uploadFile(file);
  }
}
