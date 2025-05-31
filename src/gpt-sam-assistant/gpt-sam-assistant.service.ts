import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { CreateThreadUseCase } from './use-cases';

@Injectable()
export class GptSamAssistantService {
  private openAi = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async createThread() {
    return await CreateThreadUseCase(this.openAi);
  }

  userQuestion(): string {
    return 'userQuestion';
  }
}
