import OpenAI, { toFile } from 'openai';
import { ImageEditParams, ImagesResponse } from 'openai/resources/images';

import { ModelConfigurations, saveImageToFs } from '../../helpers';

import * as fs from 'fs';
import EnvConfig from '../../../config/app.config';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService({ app: EnvConfig() });

/**
 * Options for image generation
 * @property  prompt - The text prompt for image generation
 * @property  [originalImage] - Optional base64 encoded original image for edits
 * @property  [maskImage] - Optional base64 encoded mask image for inpainting
 */
interface ImageGenerationOptions {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

// todo: receive chosen model from request
export const imageGenerationUseCase = async (
  openAi: OpenAI,
  options: ImageGenerationOptions,
) => {
  try {
    const { prompt, originalImage, maskImage } = options;

    // TODO: Implement model selection from request
    // TODO: Add support for image editing with originalImage and maskImage
    let imageName = '';
    let response: ImagesResponse;
    if (!originalImage || !maskImage) {
      // Generate the image using OpenAI's API
      response = await openAi.images.generate({
        ...ModelConfigurations.Dalle3, // Default configuration from helpers
        prompt,
      });
    } else {
      // Edit the image using mask OpenAI's API
      // const image: Image = originalImage.data![0];
      let imagePath = '';
      imagePath = await saveImageToFs(originalImage, 'url', true);

      // if (image.url) {
      //   imagePath = await saveImageToFs(image.url, 'url', true);
      // } else if (image.b64_json) {
      //   imagePath = await saveImageToFs(image.b64_json, 'b64', true);
      // }
      const maskImagePath = await saveImageToFs(maskImage, 'b64', true);

      response = await openAi.images.edit({
        ...(ModelConfigurations.GptImage1 as ImageEditParams), // Default configuration from helpers
        image: await toFile(fs.createReadStream(imagePath), null, {
          type: 'image/png',
        }),
        mask: await toFile(fs.createReadStream(maskImagePath), null, {
          type: 'image/png',
        }),
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
    // strip extension from filename
    imageName = imageName.replace(/\.[^/.]+$/, '');

    const url = `${configService.get('app.apiBaseUrl')}/gpt/image-generation/${imageName}`;
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
