import { Test, TestingModule } from '@nestjs/testing';
import { GptSamAssistantService } from './gpt-sam-assistant.service';

describe('GptSamAssistantService', () => {
  let service: GptSamAssistantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GptSamAssistantService],
    }).compile();

    service = module.get<GptSamAssistantService>(GptSamAssistantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
