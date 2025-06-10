import { Module } from '@nestjs/common';
import { IUserRepository } from './interfaces/repositories/user-repository.interface';
import { UserRepository } from './repositories/user.repository';

@Module({
  providers: [{ provide: IUserRepository, useClass: UserRepository }],
  exports: [IUserRepository],
})
export class UserModule {}
