import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GptService } from './gpt.service';
import {
  OrthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
} from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'node:path';

@ApiTags('GPT')
@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  @HttpCode(200)
  @ApiOperation({ summary: 'Revisar ortografía' })
  @ApiResponse({
    status: 200,
    description: 'Ortografía revisada correctamente',
  })
  orthographyCheck(@Body() orthographyDto: OrthographyDto) {
    return this.gptService.orthographyCheck(orthographyDto);
  }

  @Post('pros-cons-discusser')
  @HttpCode(200)
  @ApiOperation({ summary: 'Discusión de pros y contras' })
  @ApiResponse({ status: 200, description: 'Discusión generada correctamente' })
  prosConsDicusser(@Body() prosConsDiscusserDto: ProsConsDiscusserDto) {
    return this.gptService.prosConsDicusser(prosConsDiscusserDto);
  }

  @Post('pros-cons-discusser-stream')
  @HttpCode(200)
  @ApiOperation({ summary: 'Discusión de pros y contras mediante stream' })
  @ApiResponse({
    status: 200,
    description: 'Discusión generada correctamente mediante stream',
  })
  async prosConsDicusserStream(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    @Res() res: Response,
  ) {
    const stream =
      await this.gptService.prosConsDicusserStream(prosConsDiscusserDto);

    res.setHeader('Content-Type', 'application/stream+json');
    res.status(HttpStatus.OK);
    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content;
      if (piece) {
        res.write(piece);
      }
    }
    res.end();
  }

  @Post('translate')
  @HttpCode(200)
  @ApiOperation({ summary: 'Traducir texto' })
  @ApiResponse({ status: 200, description: 'Texto traducido correctamente' })
  translate(@Body() translateDto: TranslateDto) {
    return this.gptService.translate(translateDto);
  }

  @Post('text-to-audio')
  @HttpCode(200)
  @ApiOperation({ summary: 'Text to audio' })
  @ApiResponse({ status: 200, description: 'Audio generado correctamente' })
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res: Response,
  ) {
    const filePath = await this.gptService.textToAudio(textToAudioDto);

    res.setHeader('Content-Type', 'audio/mp3');
    res.sendFile(filePath);
  }

  @Get('text-to-audio/:fileName')
  @ApiOperation({ summary: 'Download Audio to text file' })
  @ApiResponse({ status: 200, description: 'Text to audio File downloaded' })
  getAudiotoText(@Param('fileName') fileName: string, @Res() res: Response) {
    const filePath = this.gptService.getTextToAudio(fileName);

    res.setHeader('Content-Type', 'audio/mp3');
    res.sendFile(filePath);
  }

  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('audio', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, audio, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExtension = path.extname(audio.originalname);
          const fileName = audio.fieldname + '-' + uniqueSuffix + fileExtension;
          callback(null, fileName);
        },
      }),
    }),
  )
  @HttpCode(200)
  @ApiOperation({ summary: 'Audio to text' })
  @ApiResponse({ status: 200, description: 'Text from audio generated' })
  async audioToText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1000 * 1024 * 5,
            message: 'Max file size is 5MB',
          }), // Max 5MB
          // new FileTypeValidator({ fileType: 'audio/*' }),
          //new FileTypeValidator({ fileType: '/audio/(mp4|mp3|wav|x-m4a)/i' }),
          // new FileTypeValidator({ fileType: /^audio\/(mp4|mp3|wav|m4a)$/i }),
        ],
        errorHttpStatusCode: 422,
      }),
    )
    audio: Express.Multer.File,
    @Body('prompt') prompt?: string,
  ) {
    if (!audio) {
      throw new BadRequestException('No file uploaded');
    }
    const allowedFileTypes = [
      'audio/mp4',
      'audio/mp3',
      'audio/wav',
      'audio/m4a',
    ];
    console.log(audio.mimetype);
    console.log({ prompt });
    if (!allowedFileTypes.includes(audio.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }
    return await this.gptService.audioToText({ audio, prompt });
  }
}
