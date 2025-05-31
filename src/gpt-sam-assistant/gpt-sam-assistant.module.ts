import { Module } from '@nestjs/common';
import { GptSamAssistantService } from './gpt-sam-assistant.service';
import { GptSamAssistantController } from './gpt-sam-assistant.controller';

@Module({
  controllers: [GptSamAssistantController],
  providers: [GptSamAssistantService],
})
export class GptSamAssistantModule {}
