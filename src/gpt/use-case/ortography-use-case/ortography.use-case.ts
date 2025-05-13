interface Options {
  prompt: string;
  maxTokens?: number;
}

export const orthographyUseCase = async (options: Options) => {
  const { prompt } = options;
  console.log({ prompt });
  return {
    prompt,
  };
};
