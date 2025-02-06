import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  getAll() {
    return `This endpoint get all the users`;
  }
}
