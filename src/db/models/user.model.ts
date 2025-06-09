import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
  PrimaryKey,
  DataType,
  Default,
} from 'sequelize-typescript';
import { CompanyModel } from './company.model';
import { UserEntity } from '../entities/user.entity';
import { RoleEnum } from '../enums/role.enum';

@Table({ tableName: 'users' })
export class UserModel extends Model implements UserEntity {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column
  name: string;

  @Column
  role: RoleEnum;

  @ForeignKey(() => CompanyModel)
  companyId: string;

  @BelongsTo(() => CompanyModel)
  company: CompanyModel;
}
