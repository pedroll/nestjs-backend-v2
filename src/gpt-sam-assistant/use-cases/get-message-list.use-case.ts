import { OpenAI } from 'openai';

interface GetListOptions {
  threadId: string;
}

/**
 * Get the list of messages in the OpenAI thread.
 * @param openai - The OpenAI instance.
 * @param getListOptions - The options containing threadId.
 * @returns The list of messages.
 */
export const GetMessageListUseCase = async (
  openai: OpenAI,
  getListOptions: GetListOptions,
) => {
  const { threadId } = getListOptions;
  const messageList = await openai.beta.threads.messages.list(threadId);

  const messages = messageList.data.map((message) => ({
    role: message.role,
    content: message.content.map((content) => {
      if (content.type === 'text') return content.text?.value;
    }),
    //       content: message.content[0].text.value as string,
  }));

  return messages.reverse();
};
