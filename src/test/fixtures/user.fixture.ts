import { UserEntity } from '@/db/entities/user.entity';
import { RoleEnum } from '@/db/enums/role.enum';
import { faker } from '@faker-js/faker';
import { v4 } from 'uuid';

export class UserFixture {
  static create(user?: Partial<UserEntity>) {
    const userEntity = new UserEntity();
    userEntity.id = v4();
    userEntity.name = faker.person.fullName();
    userEntity.companyId = v4();
    userEntity.role = faker.helpers.enumValue(RoleEnum);

    Object.assign(userEntity, user);

    return userEntity;
  }

  static createMany(howMany: number = 10, user?: Partial<UserEntity>) {
    return Array.from({ length: howMany }, () => this.create(user));
  }
}
