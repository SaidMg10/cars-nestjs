import { PartialType } from '@nestjs/mapped-types';
import { CreateCarTypeDto } from './create-car-type.dto';

export class UpdateCarTypeDto extends PartialType(CreateCarTypeDto) {}
