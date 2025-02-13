import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { unlinkSync } from 'node:fs';

@Injectable()
export class FilesService {
  constructor(private readonly logger: Logger) {
    this.logger = new Logger(FilesService.name);
  }

  uploadImage(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype))
      throw new BadRequestException('Invalid file type');

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) throw new BadRequestException('File is too large');

    return {
      messsage: 'File uploaded successfully',
      filePath: file.path,
    };
  }

  uploadImages(files: Array<Express.Multer.File>) {
    if (!files || files.length === 0)
      throw new BadRequestException('No files uploaded');

    const responses = files.map((file) => this.uploadImage(file));

    return responses;
  }

  deleteFiles(paths: string | string[]) {
    if (!paths || (Array.isArray(paths) && paths.length === 0))
      throw new BadRequestException('No image paths provided');

    const filesToDelete = Array.isArray(paths) ? paths : [paths];

    const deletedFiles = filesToDelete.map((path) => {
      try {
        unlinkSync(path);
        return { message: 'File removed successfully', paths };
      } catch (error) {
        this.logger.error(error);
        return { message: 'Error deleting file', path };
      }
    });

    return deletedFiles;
  }
}
