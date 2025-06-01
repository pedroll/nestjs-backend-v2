import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { GptSamAssistantService } from './gpt-sam-assistant.service';
import { GptSamAssistantController } from './gpt-sam-assistant.controller';

@Module({
  controllers: [GptSamAssistantController],
  providers: [GptSamAssistantService],
  imports: [ConfigModule],
})
export class GptSamAssistantModule {}
