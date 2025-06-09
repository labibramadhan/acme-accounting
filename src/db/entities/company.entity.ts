import { UserEntity } from './user.entity';
import { SequelizeEntity } from './sequelize.entity';

export class CompanyEntity extends SequelizeEntity {
  name: string;
  users: UserEntity[];
}
