import { Body, Controller, Post } from '@nestjs/common';
import { GptSamAssistantService } from './gpt-sam-assistant.service';
import { UserQuestionDto } from './dto/user-question.dto';

@Controller('gpt-sam-assistant')
export class GptSamAssistantController {
  constructor(
    private readonly gptSamAssistantService: GptSamAssistantService,
  ) {}

  @Post('create-thread')
  async createThread() {
    return await this.gptSamAssistantService.createThread();
  }

  @Post('user-question')
  userQuestion(@Body() userQuestionDto: UserQuestionDto) {
    this.gptSamAssistantService.userQuestion(userQuestionDto);
  }
}
