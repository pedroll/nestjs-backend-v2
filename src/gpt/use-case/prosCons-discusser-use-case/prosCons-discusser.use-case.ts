import OpenAI from 'openai';

interface ProsConsOptions {
  prompt: string;
}

export const prosConsDiscusserUseCase = async (
  openAi: OpenAI,
  { prompt }: ProsConsOptions,
) => {
  const response = await openAi.chat.completions.create({
    model: 'gpt-4.1-nano',

    messages: [
      {
        role: 'system',
        content: `Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
                  la respuesta debe de ser en formato markdown,
                  los pros y contras deben de estar en una lista,`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    // max_output_tokens: 500,
    temperature: 0.8,
    max_completion_tokens: 500,

    // response_format: {
    //   type: 'json_object'
    // },
  });

  return response.choices[0].message;

  // const jsonResponse = JSON.parse(response.output_text) as JSON;
  // return jsonResponse;
};
