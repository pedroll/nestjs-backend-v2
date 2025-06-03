import { imageRenamer } from './imageRenamer.helper';
import * as uuid from 'uuid';

// Mock uuid to return a predictable value
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('test-uuid'),
}));

describe('imageRenamer', () => {
  // Successfully renames a JPEG image file with UUID
  it('should rename a JPEG image file with UUID and correct extension', () => {
    // Arrange
    const req = {} as Express.Request;
    const file = {
      mimetype: 'image/jpeg',
      originalname: 'original-image.jpg',
    } as Express.Multer.File;
    const callback = jest.fn();

    // Act
    imageRenamer(req, file, callback);

    // Assert
    expect(callback).toHaveBeenCalledWith(null, 'test-uuid.jpeg');
    expect(uuid.v4).toHaveBeenCalled();
  });

  // Successfully renames a PNG image file with UUID
  it('should rename a PNG image file with UUID and correct extension', () => {
    // Arrange
    const req = {} as Express.Request;
    const file = {
      mimetype: 'image/png',
      originalname: 'original-image.png',
    } as Express.Multer.File;
    const callback = jest.fn();

    // Act
    imageRenamer(req, file, callback);

    // Assert
    expect(callback).toHaveBeenCalledWith(null, 'test-uuid.png');
    expect(uuid.v4).toHaveBeenCalled();
  });

  // Successfully renames a GIF image file with UUID
  it('should rename a GIF image file with UUID and correct extension', () => {
    // Arrange
    const req = {} as Express.Request;
    const file = {
      mimetype: 'image/gif',
      originalname: 'original-image.gif',
    } as Express.Multer.File;
    const callback = jest.fn();

    // Act
    imageRenamer(req, file, callback);

    // Assert
    expect(callback).toHaveBeenCalledWith(null, 'test-uuid.gif');
    expect(uuid.v4).toHaveBeenCalled();
  });

  // Handles files with unusual mimetypes
  it('should extract extension from any mimetype format', () => {
    // Arrange
    const req = {} as Express.Request;
    const file = {
      mimetype: 'image/svg+xml',
      originalname: 'original-image.svg',
    } as Express.Multer.File;
    const callback = jest.fn();

    // Act
    imageRenamer(req, file, callback);

    // Assert
    expect(callback).toHaveBeenCalledWith(null, 'test-uuid.svg+xml');
    expect(uuid.v4).toHaveBeenCalled();
  });

  // Reset mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });
});
