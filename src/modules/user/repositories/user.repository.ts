import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../interfaces/repositories/user-repository.interface';
import { UserEntity } from '@/db/entities/user.entity';
import { UserModel } from '@/db/models/user.model';
import { RoleEnum } from '@/db/enums/role.enum';

@Injectable()
export class UserRepository implements IUserRepository {
  async findAll({
    where,
    order,
    limit,
  }: {
    where: { companyId: string; role: RoleEnum };
    order?: [string, 'ASC' | 'DESC'][];
    limit?: number;
  }): Promise<UserEntity[]> {
    const users: UserModel[] = await UserModel.findAll({
      where,
      order,
      limit,
    });
    return users.map((user) => user.toJSON());
  }
}
