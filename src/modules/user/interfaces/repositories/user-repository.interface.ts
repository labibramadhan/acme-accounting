import { UserEntity } from '@/db/entities/user.entity';
import { RoleEnum } from '@/db/enums/role.enum';

export interface IUserRepository {
  findAll({
    where,
    order,
    limit,
  }: {
    where: { companyId: string; role: RoleEnum };
    order?: [string, 'ASC' | 'DESC'][];
    limit?: number;
  }): Promise<UserEntity[]>;
}

export const IUserRepository = Symbol('IUserRepository');
