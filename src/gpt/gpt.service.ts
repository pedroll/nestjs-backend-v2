import { Injectable, NotFoundException } from '@nestjs/common';
import OpenAI from 'openai';
import * as path from 'node:path';
import * as fs from 'fs';
import {
  AudioToTextDto,
  ImageGenerationDto,
  ImageVariationDto,
  OrthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
} from './dto';
import {
  audioToTextUseCase,
  imageGenerationUseCase,
  imageVariationUseCase,
  orthographyUseCase,
  prosConsDicusserStreamUseCase,
  prosConsDicusserUseCase,
  textToAudioUseCase,
  translateUseCase,
} from './use-case';

@Injectable()
export class GptService {
  private openAi = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async orthographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyUseCase(this.openAi, orthographyDto);
  }

  async prosConsDiscusser({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDicusserUseCase(this.openAi, { prompt });
  }

  async prosConsDiscusserStream({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDicusserStreamUseCase(this.openAi, { prompt });
  }

  async translate(translateDto: TranslateDto) {
    return await translateUseCase(this.openAi, translateDto);
  }

  async textToAudio(textToAudioDto: TextToAudioDto) {
    return await textToAudioUseCase(this.openAi, textToAudioDto);
  }

  async audioToText(audioToTextDto: AudioToTextDto) {
    return await audioToTextUseCase(this.openAi, audioToTextDto);
  }

  async imageGeneration(imageGenerationDto: ImageGenerationDto) {
    return await imageGenerationUseCase(this.openAi, { ...imageGenerationDto });
  }

  /**
   * Retrieves the full file path for a given audio or image file
   * @param filename - The name of the file without extension
   * @param type - The type of file ('audio' or 'image')
   * @returns The absolute path to the requested file
   * @throws {NotFoundException} If the requested file does not exist
   */
  getFilePath(filename: string, type: 'audio' | 'image'): string {
    // Configuration mapping for different file types
    const config = {
      audio: { ext: 'mp3', dir: 'audio' }, // Audio files are stored as .mp3 in the 'audio' directory
      image: { ext: 'png', dir: 'image' }, // Image files are stored as .png in the 'image' directory
    };

    // Construct the full file path
    // Note: Using './' as base path to be relative to the project root
    // TODO: Store in USERID path
    const storagePath = path.resolve(
      './',
      `./generated/${config[type].dir}/USERID`,
      `${filename}.${config[type].ext}`,
    );
    // Verify the file exists before returning the path
    const wasFound = fs.existsSync(storagePath);

    if (!wasFound) {
      const fileType = type.charAt(0).toUpperCase() + type.slice(1);
      console.log(`File not found: ${storagePath}`);
      throw new NotFoundException(`${fileType} file "${filename}" not found.`);
    }

    return storagePath;
  }

  async imageVariation({ baseImage }: ImageVariationDto) {
    return await imageVariationUseCase(this.openAi, { baseImage });
  }
}
