import { Test, TestingModule } from '@nestjs/testing';
import { GptAssistantController } from './gpt-assistant.controller';
import { GptAssistantService } from './gpt-assistant.service';

describe('GptAssistantController', () => {
  let controller: GptAssistantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GptAssistantController],
      providers: [GptAssistantService],
    }).compile();

    controller = module.get<GptAssistantController>(GptAssistantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
