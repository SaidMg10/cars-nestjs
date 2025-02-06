import { Controller, Get, Inject, Logger } from '@nestjs/common';

@Controller('health')
export class HealthController {
  constructor(@Inject(Logger) private readonly logger: Logger) {
    this.logger = new Logger(HealthController.name);
  }

  @Get()
  checkHealth() {
    this.logger.log('Health endpoint');
    return { status: 'OK' };
  }
}
