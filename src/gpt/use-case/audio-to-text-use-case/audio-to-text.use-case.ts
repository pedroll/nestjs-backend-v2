import OpenAI from 'openai';
import * as fs from 'node:fs';

export interface AudioToTextOptions {
  prompt?: string;
  audio: Express.Multer.File;
}

export const audioToTextUseCase = async (
  openAi: OpenAI,
  options: AudioToTextOptions,
) => {
  const { prompt, audio } = options;

  const response = await openAi.audio.transcriptions.create({
    model: 'whisper-1',
    file: fs.createReadStream(audio.path),
    prompt,
    language: 'es',
    response_format: 'verbose_json',
  });

  return response;
};
