import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import {
  CheckRunCompleteStatusUseCase,
  CreateMessageUseCase,
  CreateRunUseCase,
  CreateThreadUseCase,
  GetMessageListUseCase,
} from './use-cases';
import { UserQuestionDto } from './dto';

/**
 * GptAssistantService provides business logic for the GPT-SAM assistant.
 */
@Injectable()
export class GptAssistantService {
  private openAi = new OpenAI({
    apiKey: this.configService.get('openAiApiKey'),
  });

  constructor(private readonly configService: ConfigService) {}

  /**
   * Create a new thread.
   * @returns The created thread ID.
   */
  async createThread(): Promise<{ id: string }> {
    return await CreateThreadUseCase(this.openAi);
  }

  /**
   * Handle a user question.
   * @param questionDto - The user question data.
   * @returns The list of messages.
   */
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
