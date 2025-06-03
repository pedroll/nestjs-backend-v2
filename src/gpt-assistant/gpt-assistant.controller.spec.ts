import { Test, TestingModule } from '@nestjs/testing';
import { GptAssistantController } from './gpt-assistant.controller';
import { GptAssistantService } from './gpt-assistant.service';
import { ConfigService } from '@nestjs/config';

// Mock for ConfigService
const mockConfigService = {
  get: jest.fn((key: string) => {
    if (key === 'openAiApiKey') return 'test-api-key';
    if (key === 'openAiDefaultAssistantId') return 'test-assistant-id';
    return null;
  }),
};

describe('GptAssistantController', () => {
  let controller: GptAssistantController;
  let service: GptAssistantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GptAssistantController],
      providers: [
        GptAssistantService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<GptAssistantController>(GptAssistantController);
    service = module.get<GptAssistantService>(GptAssistantService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
