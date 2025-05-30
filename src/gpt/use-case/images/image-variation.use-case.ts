import OpenAI from 'openai';
import { ImagesResponse } from 'openai/resources/images';

import { saveImageToFs } from '../../helpers';

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
interface Options {
  baseImage: string;
}

// todo: receive chosen model from request
export const imageVariationUseCase = async (
  openAi: OpenAI,
  options: Options,
) => {
  try {
    const { baseImage } = options;

    const imagePath = await saveImageToFs(baseImage, 'url', true);

    // convert imagepath to Uploadable
    const imagetoUpload = fs.createReadStream(imagePath);

    const response: ImagesResponse = await openAi.images.createVariation({
      model: 'dall-e-2',
      image: imagetoUpload,
      n: 1,
      size: '1024x1024',
      response_format: 'url',
    });

    const imageResponse = response.data![0];

    const imageName = await saveImageToFs(imageResponse.url!, 'url', false);
    // strip extension from imageName
    const imageNameWithoutExtension = imageName.split('.')[0];
    const url = `${configService.get('app.apiBaseUrl')}/gpt/image-generation/${imageNameWithoutExtension}`;
    console.log('Variated image URL:', url);
    return {
      openaiUrl: imageResponse.url ?? undefined,
      url,
    };
  } catch (error) {
    console.error(error, 'Error saving image variation:', error);
    throw new Error('Failed to save the image variation');
  }
};
