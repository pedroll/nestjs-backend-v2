import OpenAI from 'openai';
import { TextToAudioDto } from '../../dto';

interface Options {
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
  };
  const selectedVoice: string = voices[voice ?? 'nova'] as string;

  const response = await openAi.audio.speech.create({
    model: 'gpt-4.1-mini-ts',
    voice: selectedVoice,
    input: prompt,
    //   [
    //   {
    //     role: 'system',
    //     content: `Te serán  proveídos textos en un idioma que tienes que identificar,
    //       tienes que traducirlo al idioma ${lang} y devolverlo en formato Markdown.
    //
    //       Ejemplo de salida:
    //       ##exto traducido al idioma ${lang}:
    //
    //        - <texto traducido>
    //       `,
    //   },
    //   {
    //     role: 'user',
    //     content: prompt,
    //
    //   },
    // ],
  });
  console.log(response);
  return { message: response.output_text, info: response };
};
