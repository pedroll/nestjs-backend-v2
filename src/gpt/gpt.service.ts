import { Injectable } from '@nestjs/common';
import { OrthographyDto, ProsConsDiscusserDto, TranslateDto } from './dto';
import {
  orthographyUseCase,
  prosConsDicusserStreamUseCase,
  prosConsDicusserUseCase,
  translateUseCase,
} from './use-case';
import OpenAI from 'openai';
import * as process from 'node:process';

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
}
