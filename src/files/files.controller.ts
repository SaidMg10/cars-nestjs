import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload-file')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.uploadImage(file);
  }

  @Post('upload-files')
  @UseInterceptors(FilesInterceptor('files', 5))
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.filesService.uploadImages(files);
  }

  @Delete()
  removeFile(@Body('path') path: string) {
    return this.filesService.deleteFiles(path);
  }
}
