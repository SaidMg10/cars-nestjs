import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @MinLength(5, {
    message: 'The name is too short',
  })
  @MaxLength(56, {
    message: 'The name is too long',
  })
  @IsNotEmpty()
  name: string;
}
