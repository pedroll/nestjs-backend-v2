import { Test, TestingModule } from '@nestjs/testing';
import { GptController } from './gpt.controller';
import { GptService } from './gpt.service';
import { OrthographyDto } from './dto';

describe('GptController', () => {
  let controller: GptController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GptController],
      providers: [GptService],
    }).compile();

    controller = module.get<GptController>(GptController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Successful orthography check with valid prompt
  it('should return orthography check result when given valid prompt', async () => {
    // Arrange
    const gptService = { orthographyCheck: jest.fn() };
    const controller = new GptController(gptService as any);
    const orthographyDto: OrthographyDto = { prompt: 'Check this text' };
    const expectedResult = { corrections: [] };

    gptService.orthographyCheck.mockResolvedValue(expectedResult);

    // Act
    const result = await controller.orthographyCheck(orthographyDto);

    // Assert
    expect(gptService.orthographyCheck).toHaveBeenCalledWith(orthographyDto);
    expect(result).toEqual(expectedResult);
  });
});
