import { Injectable } from '@nestjs/common';
import { OrthographyDto, ProsConsDiscusserDto } from './dto';
import { orthographyUseCase } from './use-case';
import OpenAI from 'openai';
import * as process from 'node:process';
import { prosConsDicusserUseCase } from './use-case/prosCons-dicusser-use-case/prosCons-dicusser.use-case';

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
}
