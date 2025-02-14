import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'node:fs';

@Injectable()
export class FilesService {
  constructor(private readonly logger: Logger) {
    this.logger = new Logger(FilesService.name);
  }

  async uploadImage(file: Express.Multer.File): Promise<{ filePath: string }> {
    if (!file) throw new BadRequestException('No file uploaded');

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      await this.deleteFiles(file.path);
      throw new BadRequestException('Invalid file type');
    }
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      await this.deleteFiles(file.path);
      throw new BadRequestException('File is too large');
    }
    return Promise.resolve({ filePath: file.path });
  }

  async uploadImages(files: Array<Express.Multer.File>) {
    if (!files || files.length === 0)
      throw new BadRequestException('No files uploaded');

    const responses = await Promise.all(
      files.map((file) => this.uploadImage(file)),
    );

    return responses;
  }

  async deleteFiles(
    paths: string | string[],
  ): Promise<{ message: string; path: string }[]> {
    if (!paths || (Array.isArray(paths) && paths.length === 0))
      throw new BadRequestException('No image paths provided');

    const filesToDelete = Array.isArray(paths) ? paths : [paths];

    const deletedFiles = await Promise.all(
      filesToDelete.map(async (path) => {
        try {
          await fs.unlink(path);
          return { message: 'File removed successfully', path };
        } catch (error) {
          this.logger.error(error);
          return { message: 'Error deleting file', path };
        }
      }),
    );
    return deletedFiles;
  }
}
