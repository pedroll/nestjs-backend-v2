import { Logger } from '@nestjs/common';

const logger = new Logger('ImageFileFilter');

export const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) return callback(new Error('there is no file'), false);
  if (!file.mimetype.includes('image')) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

  if (!allowedTypes.includes(file.mimetype)) {
    logger.error('Only jpeg, png, jpg, gif extensions are allowed!');
    return callback(new Error('Only image files are allowed!'), false);
  }

  logger.log({ file });
  callback(null, true);
};
