import { prosConsDiscusserUseCase } from './prosCons-discusser.use-case';

describe('prosConsDiscusserUseCase', () => {
  // Function successfully calls OpenAI API with valid prompt and returns response message
  it('should call OpenAI API and return response message when given valid prompt', async () => {
    // Arrange
    const mockOpenAi = {
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content:
                    '## Pros and Cons\n\n### Pros\n- Point 1\n- Point 2\n\n### Cons\n- Point 1\n- Point 2',
                },
              },
            ],
          }),
        },
      },
    };

    const options = { prompt: 'Should I learn TypeScript?' };

    // Act
    const result = await prosConsDiscusserUseCase(mockOpenAi as any, options);

    // Assert
    expect(mockOpenAi.chat.completions.create).toHaveBeenCalledWith({
      model: 'gpt-4.1-nano',
      messages: [
        {
          role: 'system',
          content: expect.stringContaining('pros y contras'),
        },
        {
          role: 'user',
          content: 'Should I learn TypeScript?',
        },
      ],
      temperature: 0.8,
      max_completion_tokens: 500,
    });

    expect(result).toEqual({
      content:
        '## Pros and Cons\n\n### Pros\n- Point 1\n- Point 2\n\n### Cons\n- Point 1\n- Point 2',
    });
  });

  // Function handles empty prompt string
  it('should call OpenAI API with empty prompt when prompt is empty string', async () => {
    // Arrange
    const mockOpenAi = {
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: '## Pros and Cons\n\nNo prompt provided to analyze.',
                },
              },
            ],
          }),
        },
      },
    };

    const options = { prompt: '' };

    // Act
    const result = await prosConsDiscusserUseCase(mockOpenAi as any, options);

    // Assert
    expect(mockOpenAi.chat.completions.create).toHaveBeenCalledWith({
      model: 'gpt-4.1-nano',
      messages: [
        {
          role: 'system',
          content: expect.stringContaining('pros y contras'),
        },
        {
          role: 'user',
          content: '',
        },
      ],
      temperature: 0.8,
      max_completion_tokens: 500,
    });

    expect(result).toEqual({
      content: '## Pros and Cons\n\nNo prompt provided to analyze.',
    });
  });
});
