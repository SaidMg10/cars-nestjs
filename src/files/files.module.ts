import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesController } from './files.controller';
import { extname } from 'node:path';
import { v4 as uuidv4 } from 'uuid';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const fileExt = extname(file.originalname);
          const uniqueName = `${uuidv4()}${fileExt}`;
          cb(null, uniqueName);
        },
      }),
    }),
  ],
  providers: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
