import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { TransmissionTypes } from '../enums/transmission-types.enum';

export class CreateCarDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5, {
    message: 'Model is too short.',
  })
  @MaxLength(100, {
    message: 'Model is too long.',
  })
  model: string;

  @IsInt()
  @IsNotEmpty()
  @Min(30000, {
    message: 'The price is cheaper.',
  })
  price: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(5, {
    message: 'Version is too short.',
  })
  @MaxLength(100, {
    message: 'Version is too long.',
  })
  version: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1900, {
    message: 'Year is too old. Must be after 1900.',
  })
  @Max(2099, {
    message: 'Year is too new. Must be after 2100.',
  })
  manufacturingYear: number;

  @IsInt()
  @Min(0, {
    message: 'Mileage cannot be negative.',
  })
  @Max(5000000, {
    message: 'Mileage is too high. Please check the value.',
  })
  mileage: number;

  @IsEnum(TransmissionTypes, {
    message: 'Invalid transmission type.',
  })
  transmissionType: TransmissionTypes;

  @IsString()
  @MinLength(20, {
    message: 'Description is to short.',
  })
  @MaxLength(255, {
    message: 'Description is too long.',
  })
  description: string;

  @IsUUID()
  @IsNotEmpty()
  brand: string;
}
