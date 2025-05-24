import * as path from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { InternalServerErrorException } from '@nestjs/common';
import { ImageGenerateParams, ImagesResponse } from 'openai/resources/images';

/**
 * Configuration options for GPT image generation
 * @property {string} model - The model to use for image generation
 * @property {string} prompt - The text prompt for image generation
 * @property {string} quality - Quality of the generated image
 * @property {number} n - Number of images to generate
 * @property {string} size - Dimensions of the generated image
 * @property {string} [background] - Background style for the image
 * @property {string} [output_format] - Format of the output image
 * @property {string} [response_format] - Format of the API response
 */

/**
 * Default configuration for GPT image generation with transparent background
 */
export const optionGptImage1: ImageGenerateParams = {
  model: 'gpt-image-1',
  // file: fs.createReadStream(originalImage.path),
  prompt: '',
  quality: 'auto',
  n: 1,
  size: '1024x1024',
  background: 'transparent',
  output_format: 'png',
};
/**
 * Default configuration for DALL-E 3 image generation
 */
export const optionDalle3: ImageGenerateParams = {
  model: 'dall-e-3',
  prompt: '',
  quality: 'standard',
  n: 1,
  size: '1024x1024',
  response_format: 'url',
};
/**
 * Default configuration for DALL-E 2 image generation
 */
export const optionDalle2: ImageGenerateParams = {
  model: 'dall-e-2',
  prompt: '',
  n: 1,
  size: '512x512',
  response_format: 'url',
};
/**
 * Downloads an image from a URL and saves it as a PNG file
 * @param {string} url - The URL of the image to download
 * @param {boolean} [fullPath=false] - Whether to return the full file path or just the filename
 * @returns {Promise<string>} The filename or full path of the saved image
 * @throws {InternalServerErrorException} If the image download fails
 */
export const downloadImageAsPng = async (
  url: string,
  fullPath = false,
): Promise<string> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new InternalServerErrorException('Download image was not possible');
  }

  const folderPath = path.resolve('./', './generated/images/');
  fs.mkdirSync(folderPath, { recursive: true });

  const imageNamePng = `${new Date().getTime()}.png`;
  const buffer = Buffer.from(await response.arrayBuffer());

  // fs.writeFileSync( `${ folderPath }/${ imageNamePng }`, buffer );
  const completePath = path.join(folderPath, imageNamePng);

  await sharp(buffer).png().ensureAlpha().toFile(completePath);

  return fullPath ? completePath : imageNamePng;
};

/**
 * Converts a base64 encoded image to PNG and saves it to the filesystem
 * @param {string} base64Image - The base64 encoded image string
 * @param {boolean} [fullPath=false] - Whether to return the full file path or just the filename
 * @returns {Promise<string>} The filename or full path of the saved image
 */
export const downloadBase64ImageAsPng = async (
  base64Image: string,
  fullPath = false,
): Promise<string> => {
  // Remover encabezado
  base64Image = base64Image.split(';base64,').pop()!;
  const imageBuffer = Buffer.from(base64Image, 'base64');

  const folderPath = path.resolve('./', './generated/image/');
  fs.mkdirSync(folderPath, { recursive: true });

  const imageNamePng = `${new Date().getTime()}-64.png`;

  const completePath = path.join(folderPath, imageNamePng);
  // Transformar a RGBA, png // Así lo espera OpenAI
  await sharp(imageBuffer).png().ensureAlpha().toFile(completePath);

  return fullPath ? completePath : imageNamePng;
};

/**
 * Saves an image from OpenAI's API response to the filesystem
 * @param {ImagesResponse} response - The response from OpenAI's image generation API
 * @returns {Promise<{openaiUrl: string | null, localPath: string, revisedPrompt: string | undefined}>} Object containing URL, local path, and revised prompt
 * @throws {InternalServerErrorException} If the image download fails
 */
export const saveImageToFs = async (
  response: ImagesResponse,
): Promise<{
  openaiUrl?: string | null;
  localPath: string;
  revisedPrompt?: string | undefined;
}> => {
  // Initialize variables for image data
  let image_bytes: Buffer | null = null;

  // Create the directory if it doesn't exist
  const storageDir = path.resolve('./', './generated/image/USERID');
  fs.mkdirSync(storageDir, { recursive: true });

  // Create a unique filename for the image
  const imageFile = path.join(storageDir, `${Date.now()}.png`);

  // Handle base64 encoded image
  if (response.data?.[0]?.b64_json) {
    image_bytes = Buffer.from(response.data[0].b64_json, 'base64');
  }
  // Handle URL-based image
  else if (response.data?.[0]?.url) {
    const remoteImage = await fetch(response.data[0].url);
    if (!remoteImage.ok) {
      throw new InternalServerErrorException('Download image was not possible');
    }
    image_bytes = Buffer.from(await remoteImage.arrayBuffer());
  } else {
    throw new InternalServerErrorException(
      'No valid image data found in the response',
    );
  }
  // Debug logging can be uncommented if needed
  // console.log({ imageFile });
  // Process and save the image directly to the target file
  await sharp(image_bytes).png().ensureAlpha().toFile(imageFile);

  return {
    openaiUrl: response.data[0].url,
    localPath: imageFile,
    revisedPrompt: response.data[0].revised_prompt,
  };
};
