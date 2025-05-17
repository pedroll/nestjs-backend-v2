import OpenAI from 'openai';
import { TranslateDto } from '../../dto';

interface Options {
  prompt: string;
  maxTokens?: number;
}

export const translateUseCase = async (
  openAi: OpenAI,
  translateDto: TranslateDto,
) => {
  const { prompt, lang } = translateDto;

  const response = await openAi.responses.create({
    model: 'gpt-4.1-nano',
    input: [
      {
        role: 'system',
        content: `Te serán  proveídos textos en un idioma que tienes que identificar,
          tienes que traducirlo al idioma ${lang} y devolverlo en formato Markdown.
                   
          Ejemplo de salida:
          ##exto traducido al idioma ${lang}:
          
           - <texto traducido>
          `,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    max_output_tokens: 200,
    temperature: 0.2,
  });
  console.log(response);
  return { message: response.output_text, info: response };
};
