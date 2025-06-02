import { OpenAI } from 'openai';
import { Run } from 'openai/resources/beta/threads/runs/runs';

interface CheckRunStatusOptions {
  runId: string;
  threadId: string;
}

/**
 * Check the status of a run in the OpenAI thread.
 * @param openai - The OpenAI instance.
 * @param options - The options containing threadId and runId.
 * @returns The run status.
 */
export const CheckRunCompleteStatusUseCase = async (
  openai: OpenAI,
  options: CheckRunStatusOptions,
): Promise<Run> => {
  const { threadId, runId } = options;

  const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

  if (runStatus.status === 'completed') {
    return runStatus;
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return await CheckRunCompleteStatusUseCase(openai, options);
};
