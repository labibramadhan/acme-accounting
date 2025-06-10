import { RoleEnum } from '../enums/role.enum';
import { CompanyEntity } from './company.entity';
import { SequelizeEntity } from './sequelize.entity';

export class UserEntity extends SequelizeEntity {
  name: string;
  role: RoleEnum;
  companyId: string;
  company: CompanyEntity;
}
