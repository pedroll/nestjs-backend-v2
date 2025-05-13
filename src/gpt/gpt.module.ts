import { Module } from '@nestjs/common';
import { GptService } from './gpt.service';
import { GptController } from './gpt.controller';
import { ortographyUseCase } from './use-case/ortography-use-case/ortography-use.case';

@Module({
  controllers: [GptController, ortographyUseCase],
  providers: [GptService],
})
export class GptModule {}
