import { IntersectionType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

class GetCarsBaseDto {
  @IsOptional()
  @IsString()
  brandId?: string;

  @IsOptional()
  @IsString()
  carTypeId?: string;
}

export class GetCarsDto extends IntersectionType(
  GetCarsBaseDto,
  PaginationQueryDto,
) {}
