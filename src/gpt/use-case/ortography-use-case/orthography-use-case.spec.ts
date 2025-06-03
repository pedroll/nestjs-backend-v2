import { orthographyUseCase } from './ortography.use-case';
import OpenAI from 'openai';

describe('orthographyUseCase', () => {
  // Successfully calls OpenAI API with valid prompt and returns parsed JSON response
  it('should call OpenAI API and return parsed JSON response when given valid prompt', async () => {
    // Arrange
    const mockResponse = {
      output_text: JSON.stringify({
        userScore: 90,
        errors: ['errór -> error'],
        message: '¡Muy bien!',
      }),
    };

    const mockOpenAi = {
      responses: {
        create: jest.fn().mockResolvedValue(mockResponse),
      },
    } as unknown as OpenAI;

    const options = {
      prompt: 'Este es un texto con errór ortográfico',
      maxTokens: 100,
    };

    // Act
    const result = await orthographyUseCase(mockOpenAi, options);

    // Assert
    expect(mockOpenAi.responses.create).toHaveBeenCalledWith({
      model: 'gpt-4.1-nano',
      input: [
        {
          role: 'system',
          content: expect.any(String),
        },
        {
          role: 'user',
          content: options.prompt,
        },
      ],
      max_output_tokens: options.maxTokens,
      temperature: 0.2,
    });

    expect(result).toEqual({
      userScore: 90,
      errors: ['errór -> error'],
      message: '¡Muy bien!',
    });
  });

  // Handles empty prompt string
  it('should handle empty prompt string and call API correctly', async () => {
    // Arrange
    const mockResponse = {
      output_text: JSON.stringify({
        userScore: 100,
        errors: [],
        message: '¡Perfecto! No hay errores.',
      }),
    };

    const mockOpenAi = {
      responses: {
        create: jest.fn().mockResolvedValue(mockResponse),
      },
    } as unknown as OpenAI;

    const options = {
      prompt: '',
      maxTokens: 50,
    };

    // Act
    const result = await orthographyUseCase(mockOpenAi, options);

    // Assert
    expect(mockOpenAi.responses.create).toHaveBeenCalledWith({
      model: 'gpt-4.1-nano',
      input: [
        {
          role: 'system',
          content: expect.any(String),
        },
        {
          role: 'user',
          content: '',
        },
      ],
      max_output_tokens: 50,
      temperature: 0.2,
    });

    expect(result).toEqual({
      userScore: 100,
      errors: [],
      message: '¡Perfecto! No hay errores.',
    });
  });
});
