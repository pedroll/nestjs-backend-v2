import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import {
  CheckRunCompleteStatusUseCase,
  CreateMessageUseCase,
  CreateRunUseCase,
  CreateThreadUseCase,
  GetMessageListUseCase,
} from './use-cases';
import { UserQuestionDto } from './dto';

@Injectable()
export class GptSamAssistantService {
  private openAi = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async createThread() {
    return await CreateThreadUseCase(this.openAi);
  }

  async userQuestion(questionDto: UserQuestionDto) {
    const message = await CreateMessageUseCase(this.openAi, questionDto);

    const run = await CreateRunUseCase(this.openAi, {
      threadId: questionDto.threadId,
      assistantId: message.assistant_id ?? 'some fixed id',
    });

    await CheckRunCompleteStatusUseCase(this.openAi, {
      threadId: questionDto.threadId,
      runId: run.id,
    });

    const messages = await GetMessageListUseCase(this.openAi, {
      threadId: questionDto.threadId,
    });

    return messages;
  }
}
