import { Test, TestingModule } from '@nestjs/testing';
import { GptAssistantService } from './gpt-assistant.service';

describe('GptAssistantService', () => {
  let service: GptAssistantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GptAssistantService],
    }).compile();

    service = module.get<GptAssistantService>(GptAssistantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
