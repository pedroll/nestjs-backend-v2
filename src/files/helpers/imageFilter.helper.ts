import { BadRequestException, Logger } from '@nestjs/common';

const logger = new Logger('ImageFileFilter');

export const imageFileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file)
    return callback(new BadRequestException('there is no file'), false);
  if (!file.mimetype.includes('image')) {
    return callback(
      new BadRequestException('Only image files are allowed!'),
      false,
    );
  }
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

  if (!allowedTypes.includes(file.mimetype)) {
    logger.error('Only jpeg, png, jpg, gif extensions are allowed!');
    return callback(
      new BadRequestException('Only image files are allowed!'),
      false,
    );
  }

  logger.log({ file });
  callback(null, true);
};
