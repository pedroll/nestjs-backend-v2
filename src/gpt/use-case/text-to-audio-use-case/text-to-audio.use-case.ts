import OpenAI from 'openai';
import { TextToAudioDto } from '../../dto';
import * as path from 'node:path';
import * as fs from 'node:fs';

interface TextToAudioOptions {
  prompt: string;
  maxTokens?: number;
}

export const textToAudioUseCase = async (
  openAi: OpenAI,
  texToAudioDto: TextToAudioDto,
) => {
  const { prompt, voice } = texToAudioDto;
  const voices = {
    nova: 'nova',
    alloy: 'alloy',
    echo: 'echo',
    fable: 'fable',
    onyx: 'onyx',
    shimmer: 'shimmer',
    ash: 'ash',
    ballad: 'ballad',
    coral: 'coral',
    sage: 'sage',
    verse: 'verse',
  };
  const selectedVoice: string = voices[voice ?? 'nova'] || 'nova';

  const storagePath = path.resolve(
    __dirname,
    '../../../../generated/audio/USERID',
  );
  const speechFile = path.join(storagePath, `${Date.now()}.mp3`);
  fs.mkdirSync(storagePath, { recursive: true });

  const response = await openAi.audio.speech.create({
    model: 'tts-1',
    voice: selectedVoice,
    input: prompt,
    response_format: 'mp3',
  });
  console.log(response);
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(speechFile, buffer);

  return speechFile;
};
