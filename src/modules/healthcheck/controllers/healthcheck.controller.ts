import { Controller, Get } from '@nestjs/common';
import { UserModel } from '../../../db/models/user.model';

@Controller('api/v1/healthcheck')
export class HealthcheckController {
  @Get()
  async ping() {
    await UserModel.findAll();
    return {
      OK: true,
    };
  }
}
