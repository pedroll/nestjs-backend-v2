import OpenAI from 'openai';

interface Options {
  prompt: string;
  maxTokens?: number;
}

export const orthographyUseCase = async (openAi: OpenAI, options: Options) => {
  const { prompt, maxTokens } = options;

  const response = await openAi.responses.create({
    model: 'gpt-4.1-nano',
    input: [
      {
        role: 'system',
        content: `Te serán  proveídos textos en español con posible errores ortográficos y gramaticales,
          Las palabras deben existir en el diccionario de la Real Academia Española
          Debes responder en formato JSON,
          tu tarea es corregirlos y retornar información de soluciones,
          tambien debes dar ub porcentaje de acierto para el usuario.
          
          Si no hay errores felicita al usuario.
          
          Ejemplo de salida:
          {
          userScore: number,
          errors: string[] // ['error -> solución'],
          message: string, // usa emojis y texto para felicitar al usuario
          }`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    max_output_tokens: maxTokens,
    temperature: 0.2,
    // response_format: {
    //   type: 'json_object'
    // },
  });
  // console.log(response);
  const jsonResponse = JSON.parse(response.output_text) as JSON;
  return jsonResponse;
};
