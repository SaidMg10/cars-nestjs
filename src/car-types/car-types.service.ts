import { Injectable } from '@nestjs/common';
import { CreateCarTypeDto } from './dto/create-car-type.dto';
import { UpdateCarTypeDto } from './dto/update-car-type.dto';

@Injectable()
export class CarTypesService {
  create(createCarTypeDto: CreateCarTypeDto) {
    console.log(createCarTypeDto);
    return 'This action adds a new carType';
  }

  findAll() {
    return `This action returns all carTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} carType`;
  }

  update(id: number, updateCarTypeDto: UpdateCarTypeDto) {
    console.log(updateCarTypeDto);
    return `This action updates a #${id} carType`;
  }

  remove(id: number) {
    return `This action removes a #${id} carType`;
  }
}
