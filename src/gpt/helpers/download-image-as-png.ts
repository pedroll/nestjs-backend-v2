import * as path from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';

import { InternalServerErrorException } from '@nestjs/common';
import { ImageGenerateParams, ImagesResponse } from 'openai/resources/images';

export const optionGptImage1: ImageGenerateParams = {
  model: 'gpt-image-1',
  // file: fs.createReadStream(originalImage.path),
  prompt: '',
  quality: 'low',
  n: 1,
  size: '1024x1024',
  background: 'transparent',
  output_format: 'png',
};
export const optionDalle3: ImageGenerateParams = {
  model: 'dall-e-3',
  prompt: '',
  quality: 'standard',
  n: 1,
  size: '1024x1024',
  response_format: 'url',
};
export const downloadImageAsPng = async (url: string, fullPath = false) => {
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

export const downloadBase64ImageAsPng = async (
  base64Image: string,
  fullPath = false,
) => {
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

export const saveImageToFs = async (response: ImagesResponse) => {
  // Save the image to a file
  let image_base64: string;
  let image_bytes: Buffer<ArrayBuffer>;

  const storagePath = path.resolve('./', './generated/image/USERID');

  const imageFile = path.join(storagePath, `${Date.now()}.png`);
  fs.mkdirSync(storagePath, { recursive: true });

  if (response.data![0].b64_json) {
    image_base64 = response.data![0].b64_json;
    image_bytes = Buffer.from(image_base64, 'base64');
    fs.writeFileSync(imageFile, image_bytes);
  } else if (response.data![0].url) {
    const remoteImage = await fetch(response.data![0].url);

    if (!remoteImage.ok) {
      throw new InternalServerErrorException('Download image was not possible');
    }
    // if base64image
    //   base64Image = base64Image.split(';base64,').pop()!;
    image_bytes = Buffer.from(await remoteImage.arrayBuffer());
    await sharp(image_bytes).png().ensureAlpha().toFile(storagePath);
  }

  return {
    url: response.data![0].url,
    localPath: imageFile,
    revisedPrompt: response.data![0].revised_prompt,
  };
};
