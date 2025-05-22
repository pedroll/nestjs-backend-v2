import OpenAI from 'openai';
import { ImagesResponse } from 'openai/resources/images';

import { optionGptImage1, saveImageToFs } from '../../helpers';

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

// todo: receive chosen model from request
export const imageGenerationUseCase = async (
  openAi: OpenAI,
  options: Options,
) => {
  const { prompt, originalImage, maskImage } = options;

  console.log({ prompt, originalImage, maskImage });

  // todo: check original image
  const response: ImagesResponse = await openAi.images.generate({
    ...optionGptImage1,
    prompt,
  });
  console.log(response);
  if (!response) return;

  // Save the image to a file
  return saveImageToFs(response);
};
