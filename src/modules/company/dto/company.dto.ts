import { SequelizeEntity } from '@/db/entities/sequelize.entity';
import { UserDTO } from '@/modules/user/dto/user.dto';
import { Type } from 'class-transformer';

export class CompanyDTO extends SequelizeEntity {
  name: string;

  @Type(() => UserDTO)
  users: UserDTO[];
}
