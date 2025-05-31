import { OpenAI } from 'openai';
import { Run } from 'openai/resources/beta/threads/runs/runs';

interface CreateRunOptions {
  assistantId: string;
  threadId: string;
  model?: string;
  instructions?: string | null;
  tools?: [string] | null;
  metadata?: Record<string, unknown> | null;
}

export const CreateRunUseCase = async (
  openai: OpenAI,
  options: CreateRunOptions,
): Promise<Run> => {
  const { threadId, assistantId } = options;

  const run = await openai.beta.threads.runs.createAndPoll(threadId, {
    assistant_id: assistantId,
    // instructions, // caution overwrite assistant
  });

  return run;
};
