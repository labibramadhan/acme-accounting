import { Module } from '@nestjs/common';
import { HealthcheckController } from './controllers/healthcheck.controller';

@Module({
  controllers: [HealthcheckController],
})
export class HealthcheckModule {}
