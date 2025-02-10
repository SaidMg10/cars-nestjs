import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCarTypeDto {
  @IsString()
  @MaxLength(56, { message: 'The name is too long' })
  @MinLength(1, { message: 'The name is too short' })
  @IsNotEmpty()
  name: string;
}
