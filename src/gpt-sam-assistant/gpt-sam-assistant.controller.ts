import { Controller, Post } from '@nestjs/common';
import { GptSamAssistantService } from './gpt-sam-assistant.service';

@Controller('gpt-sam-assistant')
export class GptSamAssistantController {
  constructor(
    private readonly gptSamAssistantService: GptSamAssistantService,
  ) {
  }

  @Post('create-thread')
  async this

.
  gptSamAssistantService;
.

  createThread() {
    return 'createThread';
  }

  @Post('user-question')
  async this

.
  gptSamAssistantService;
.

  userQuestion() {
    return 'createThread';
  }
}
