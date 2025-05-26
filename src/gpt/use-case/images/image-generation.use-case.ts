import OpenAI from 'openai';
import {
  Image,
  ImageEditParams,
  ImagesResponse,
} from 'openai/resources/images';

import { optionDalle3, optionGptImage1, saveImageToFs } from '../../helpers';

import * as fs from 'fs';

/**
 * Options for image generation
 * @property {string} prompt - The text prompt for image generation
 * @property {string} [originalImage] - Optional base64 encoded original image for edits
 * @property {string} [maskImage] - Optional base64 encoded mask image for inpainting
 */
interface Options {
  prompt: string;
  originalImage?: ImagesResponse;
  maskImage?: string;
}

// todo: receive chosen model from request
export const imageGenerationUseCase = async (
  openAi: OpenAI,
  options: Options,
) => {
  try {
    const { prompt, originalImage, maskImage } = options;

    // TODO: Implement model selection from request
    // TODO: Add support for image editing with originalImage and maskImage
    let imageName;
    let response: ImagesResponse;
    // Generate the image using OpenAI's API
    if (!originalImage || !maskImage) {
      response = await openAi.images.generate({
        ...optionDalle3, // Default configuration from helpers
        prompt,
      });
    } else {
      const image: Image = originalImage.data![0];
      let imagePath = '';
      if (image.url) {
        imagePath = await saveImageToFs(image.url, 'url', true);
      } else if (image.b64_json) {
        imagePath = await saveImageToFs(image.b64_json, 'b64', true);
      }
      const maskImagePath = await saveImageToFs(maskImage, 'b64', true);

      response = await openAi.images.edit({
        ...(optionGptImage1 as ImageEditParams), // Default configuration from helpers
        image: fs.createReadStream(imagePath),
        mask: fs.createReadStream(maskImagePath),
        prompt,
      });
    }
    if (!response) {
      console.error('No image data received from OpenAI');
      return;
    }
    const imageResponse = response.data![0];

    // Save the generated image to the filesystem
    if (imageResponse.url) {
      imageName = await saveImageToFs(imageResponse.url, 'url');
    } else if (imageResponse.b64_json) {
      imageName = await saveImageToFs(imageResponse.b64_json, 'b64');
    }

    const url = `${process.env.BASE_URL}/gpt/image-generation/${imageName}`;

    return {
      openaiUrl: imageResponse.url ?? undefined,
      url,
      revisedPrompt: imageResponse.revised_prompt ?? prompt ?? undefined,
    };
  } catch (error) {
    console.error('Error saving generated image:', error);
    throw new Error('Failed to save the generated image');
  }
};
