import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { GptAssistantService } from './gpt-assistant.service';
import { GptAssistantController } from './gpt-assistant.controller';

@Module({
  controllers: [GptAssistantController],
  providers: [GptAssistantService],
  imports: [ConfigModule],
})
export class GptAssistantModule {}
