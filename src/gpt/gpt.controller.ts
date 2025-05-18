import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
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
}
