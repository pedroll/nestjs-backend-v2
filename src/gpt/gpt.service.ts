import { Injectable } from '@nestjs/common';
import { OrthographyDto } from './dto';
import { orthographyUseCase } from './use-case';
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
}
