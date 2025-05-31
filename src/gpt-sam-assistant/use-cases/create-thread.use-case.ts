import { OpenAI } from 'openai';

export const CreateThreadUseCase = async (openai: OpenAI) => {
  const { id } = await openai.beta.threads.create();
  return { id };
};
