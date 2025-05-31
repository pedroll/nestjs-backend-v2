import { OpenAI } from 'openai';
import { UserQuestionDto } from '../dto';
import { Message } from 'openai/resources/beta/threads/messages';

export const CreateMessageUseCase = async (
  openai: OpenAI,
  options: UserQuestionDto,
) => {
  const { threadId, question } = options;

  const message: Message = await openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: question,
  });

  return message;
};
