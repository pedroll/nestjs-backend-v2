import { Injectable, NotFoundException } from '@nestjs/common';
import OpenAI from 'openai';
import * as process from 'node:process';
import * as path from 'node:path';
import * as fs from 'fs';
import {
  AudioToTextDto,
  ImageGenerationDto,
  OrthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
} from './dto';
import {
  audioToTextUseCase,
  imageGenerationUseCase,
  orthographyUseCase,
  prosConsDicusserStreamUseCase,
  prosConsDicusserUseCase,
  textToAudioUseCase,
  translateUseCase,
} from './use-case';

@Injectable()
export class GptService {
  private openAi = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async orthographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyUseCase(this.openAi, orthographyDto);
  }

  async prosConsDicusser({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDicusserUseCase(this.openAi, { prompt });
  }

  async prosConsDicusserStream({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDicusserStreamUseCase(this.openAi, { prompt });
  }

  async translate(translateDto: TranslateDto) {
    return await translateUseCase(this.openAi, translateDto);
  }

  async textToAudio(textToAudioDto: TextToAudioDto) {
    return await textToAudioUseCase(this.openAi, textToAudioDto);
  }

  getTextToAudio(filename: string): string {
    console.log(filename);

    const storagePath = path.resolve(
      __dirname,
      '../../generated/audio/USERID',
      `${filename}.mp3`,
    );
    console.log(storagePath);

    const wasFound = fs.existsSync(storagePath);

    if (!wasFound) {
      throw new NotFoundException(`Audio file "${filename}" not found`);
    }
    return storagePath;
  }

  async audioToText(audioToTextDto: AudioToTextDto) {
    return await audioToTextUseCase(this.openAi, audioToTextDto);
  }

  async imageGeneration(imageGenerationDto: ImageGenerationDto) {
    return await imageGenerationUseCase(this.openAi, { ...imageGenerationDto });
  }
}
