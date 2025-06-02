import { OpenAI } from 'openai';

/**
 * Create a new thread in the OpenAI instance.
 * @param openai - The OpenAI instance.
 * @returns The created thread ID.
 */
export const CreateThreadUseCase = async (
  openai: OpenAI,
): Promise<{ id: string }> => {
  const { id } = await openai.beta.threads.create();
  return { id };
};
