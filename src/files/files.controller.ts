import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from './helpers/imageFilter.helper';
import { diskStorage } from 'multer';
import { imageRenamer } from './helpers/imageRenamer.helper';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('product/:imageName')
  @ApiOperation({ summary: 'Get product image by name' })
  @ApiParam({ name: 'imageName', description: 'Name of the image file' })
  @ApiResponse({
    status: 200,
    description: 'The image file has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Image not found' })
  findProductImage(
    @Res() res: Response, // hacemos override de la response de nest para servir la image en lugar del absolute path
    @Param('imageName') imageName: string,
  ): void {
    const path = this.filesService.getProductImage(imageName);
    res.sendFile(path);
  }

  @Post('product')
  @ApiOperation({ summary: 'Upload a product image' })
  @ApiResponse({
    status: 201,
    description: 'The image file has been successfully uploaded.',
  })
  @ApiResponse({ status: 400, description: 'Invalid file format or size' })
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
    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${
      file.filename
    }`;

    return { secureUrl, fileName: file.filename };
  }
}
