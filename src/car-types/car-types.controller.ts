import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CarTypesService } from './car-types.service';
import { CreateCarTypeDto } from './dto/create-car-type.dto';
import { UpdateCarTypeDto } from './dto/update-car-type.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('car-types')
export class CarTypesController {
  constructor(private readonly carTypesService: CarTypesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createCarTypeDto: CreateCarTypeDto,
  ) {
    return this.carTypesService.create(createCarTypeDto, file);
  }

  @Get()
  findAll() {
    return this.carTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carTypesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCarTypeDto: UpdateCarTypeDto) {
    return this.carTypesService.update(id, updateCarTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carTypesService.remove(id);
  }
}
