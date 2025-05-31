import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import {
  CreateMessageUseCase,
  CreateRunUseCase,
  CreateThreadUseCase,
} from './use-cases';
import { UserQuestionDto } from './dto';
import { Run } from 'openai/resources/beta/threads/runs/runs';

@Injectable()
export class GptSamAssistantService {
  private openAi = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async createThread() {
    return await CreateThreadUseCase(this.openAi);
  }

  async userQuestion(question: UserQuestionDto): Promise<Run> {
    const message = await CreateMessageUseCase(this.openAi, question);
    const run = await CreateRunUseCase(this.openAi, {
      threadId: question.threadId,
      assistantId: message.assistant_id ?? 'some fixed id',
    });
    return run;
  }
}
