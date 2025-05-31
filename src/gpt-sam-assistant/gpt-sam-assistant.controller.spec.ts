import { Test, TestingModule } from '@nestjs/testing';
import { GptSamAssistantController } from './gpt-sam-assistant.controller';
import { GptSamAssistantService } from './gpt-sam-assistant.service';

describe('GptSamAssistantController', () => {
  let controller: GptSamAssistantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GptSamAssistantController],
      providers: [GptSamAssistantService],
    }).compile();

    controller = module.get<GptSamAssistantController>(
      GptSamAssistantController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
