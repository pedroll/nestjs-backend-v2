import {
  AudioToTextOptions,
  audioToTextUseCase,
} from './audio-to-text.use-case';
import OpenAI from 'openai';

describe('audioToTextUseCase', () => {
  // Successfully transcribes audio file with default options
  it('should successfully transcribe audio file with default options', async () => {
    // Arrange
    const mockOpenAi = {
      audio: {
        transcriptions: {
          create: jest.fn().mockResolvedValue({
            text: 'Transcribed text',
            language: 'es',
          }),
        },
      },
    } as unknown as OpenAI;

    const mockAudioFile = {
      path: '/path/to/audio.mp3',
    } as Express.Multer.File;

    // Act
    const result = await audioToTextUseCase(mockOpenAi, {
      audio: mockAudioFile,
    });

    // Assert
    expect(mockOpenAi.audio.transcriptions.create).toHaveBeenCalledWith({
      model: 'whisper-1',
      file: expect.any(Object),
      prompt: undefined,
      language: 'es',
      response_format: 'verbose_json',
    });
    expect(result).toEqual({
      text: 'Transcribed text',
      language: 'es',
    });
  });

  // Handles missing audio file in options
  it('should throw error when audio file is missing', async () => {
    // Arrange
    const mockOpenAi = {
      audio: {
        transcriptions: {
          create: jest.fn(),
        },
      },
    } as unknown as OpenAI;

    const options = {} as AudioToTextOptions;

    // Act & Assert
    await expect(audioToTextUseCase(mockOpenAi, options)).rejects.toThrow();

    expect(mockOpenAi.audio.transcriptions.create).not.toHaveBeenCalled();
  });
});
