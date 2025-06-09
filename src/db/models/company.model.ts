import {
  Table,
  Column,
  Model,
  HasMany,
  PrimaryKey,
  DataType,
  Default,
} from 'sequelize-typescript';
import { UserModel } from './user.model';
import { CompanyEntity } from '../entities/company.entity';

@Table({ tableName: 'companies' })
export class CompanyModel extends Model implements CompanyEntity {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column
  declare name: string;

  @HasMany(() => UserModel)
  declare users: UserModel[];
}
