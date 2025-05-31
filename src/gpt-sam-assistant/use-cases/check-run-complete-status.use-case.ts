import { OpenAI } from 'openai';
import { Run } from 'openai/resources/beta/threads/runs/runs';

interface CheckRunStatusOptions {
  runId: string;
  threadId: string;
}

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
