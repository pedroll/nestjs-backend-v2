import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { CreateMessageUseCase, CreateThreadUseCase } from './use-cases';
import { UserQuestionDto } from './dto';
import { Message } from 'openai/resources/beta/threads/messages';

@Injectable()
export class GptSamAssistantService {
  private openAi = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async createThread() {
    return await CreateThreadUseCase(this.openAi);
  }

  async userQuestion(question: UserQuestionDto): Promise<Message> {
    return await CreateMessageUseCase(this.openAi, question);
  }
}
