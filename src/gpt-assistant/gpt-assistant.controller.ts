import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GptAssistantService } from './gpt-assistant.service';
import { UserQuestionDto } from './dto';

/**
 * GptAssistantController handles HTTP requests related to the GPT-SAM assistant.
 */
@ApiTags('gpt-assistant')
@Controller('gpt-assistant')
export class GptAssistantController {
  constructor(private readonly gptAssistantService: GptAssistantService) {}

  /**
   * Create a new thread.
   * @returns The created thread ID.
   */
  @Post('create-thread')
  @ApiOperation({ summary: 'Create a new thread' })
  @ApiResponse({ status: 201, description: 'Thread created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createThread(): Promise<{ id: string }> {
    return await this.gptAssistantService.createThread();
  }

  /**
   * Handle a user question.
   * @param userQuestionDto - The user question data.
   */
  @Post('user-question')
  @ApiOperation({ summary: 'Submit a user question' })
  @ApiResponse({ status: 200, description: 'Question processed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async userQuestion(@Body() userQuestionDto: UserQuestionDto) {
    return await this.gptAssistantService.userQuestion(userQuestionDto);
  }
}
