import * as path from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { InternalServerErrorException } from '@nestjs/common';
import { ImageGenerateParams } from 'openai/resources';

type ImageType = 'b64' | 'url' | 'fileName';

/**
 * Default MODELS configuration for GPT image
 */
export const ModelConfigurations = {
  GptImage1: {
    model: 'gpt-image-1',
    prompt: '',
    quality: 'auto',
    n: 1,
    size: '1024x1024',
    background: 'transparent',
    output_format: 'png',
  } as ImageGenerateParams,

  Dalle3: {
    model: 'dall-e-3',
    prompt: '',
    quality: 'standard',
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  } as ImageGenerateParams,

  Dalle2: {
    model: 'dall-e-2',
    prompt: '',
    n: 1,
    size: '512x512',
    response_format: 'url',
  } as ImageGenerateParams,
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
 * Saves an image from OpenAI's API Image to the filesystem
 * @param {ImagesResponse} Image - The Image from OpenAI's image generation API
 * @param fullPath
 * @returns {Promise<{openaiUrl: string | null, localImagePath: string, revisedPrompt: string | undefined}>} Object containing URL, local path, and revised prompt
 * @throws {InternalServerErrorException} If the image download fails
 */
export const saveImageToFs = async (
  inputImage: string,
  imageType: ImageType = 'fileName',
  fullPath = false,
): Promise<string> => {
  // Create the directory if it doesn't exist
  const storageDir = path.resolve('./', './generated/image/USERID');
  fs.mkdirSync(storageDir, { recursive: true });

  // Initialize variables for image data
  let imageNamePng = '';
  let image_bytes: Buffer;
  let remoteImage: Response;
  let base64Image: string;

  switch (imageType) {
    case 'fileName':
      imageNamePng = inputImage;
      image_bytes = fs.readFileSync(inputImage);
      break;
    case 'url':
      // Handle URL-based image
      imageNamePng = `${Date.now()}.png`;

      remoteImage = await fetch(inputImage);
      if (!remoteImage.ok) {
        throw new InternalServerErrorException(
          'Download image was not possible',
        );
      }
      image_bytes = Buffer.from(await remoteImage.arrayBuffer());
      break;
    case 'b64':
      // Handle base64 encoded image
      imageNamePng = `${Date.now()}-64.png`;

      base64Image = inputImage.split(';base64,').pop()!;
      image_bytes = Buffer.from(base64Image, 'base64');
      break;
    default:
      throw new InternalServerErrorException('Invalid image type');
  }

  // Create a unique filename for the image
  const imageFilePath = path.join(storageDir, imageNamePng);

  if (imageType !== 'fileName') {
    await sharp(image_bytes).png().ensureAlpha().toFile(imageFilePath);
  }

  return fullPath ? imageFilePath : imageNamePng;
};
