import OpenAI from 'openai';
import { ImagesResponse } from 'openai/resources/images';

import { optionDalle3, saveImageToFs } from '../../helpers';

/**
 * Options for image generation
 * @property {string} prompt - The text prompt for image generation
 * @property {string} [originalImage] - Optional base64 encoded original image for edits
 * @property {string} [maskImage] - Optional base64 encoded mask image for inpainting
 */
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

  // TODO: Implement model selection from request
  // TODO: Add support for image editing with originalImage and maskImage

  // Generate the image using OpenAI's API
  const response: ImagesResponse = await openAi.images.generate({
    ...optionDalle3, // Default configuration from helpers
    prompt,
  });

  if (!response?.data?.[0]) {
    console.error('No image data received from OpenAI');
    return;
  }

  try {
    // Save the generated image to the filesystem
    return await saveImageToFs(response);
  } catch (error) {
    console.error('Error saving generated image:', error);
    throw new Error('Failed to save the generated image');
  }
};
