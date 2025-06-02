import { OpenAI } from 'openai';
import { UserQuestionDto } from '../dto';
import { Message } from 'openai/resources/beta/threads/messages';

/**
 * Create a message in the OpenAI thread.
 * @param openai - The OpenAI instance.
 * @param options - The options containing threadId and question.
 * @returns The created message.
 */
export const CreateMessageUseCase = async (
  openai: OpenAI,
  options: UserQuestionDto,
): Promise<Message> => {
  const { threadId, question } = options;

  const message: Message = await openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: question,
  });

  return message;
};
