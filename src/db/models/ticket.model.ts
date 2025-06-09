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
import { UserModel } from './user.model';
import { TicketEntity } from '../entities/ticket.entity';
import { TicketCategory, TicketStatus, TicketType } from '../enums/ticket.enum';

@Table({ tableName: 'tickets' })
export class TicketModel extends Model implements TicketEntity {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column
  type: TicketType;

  @Column
  status: TicketStatus;

  @Column
  category: TicketCategory;

  @ForeignKey(() => CompanyModel)
  companyId: string;

  @ForeignKey(() => UserModel)
  assigneeId: string;

  @BelongsTo(() => CompanyModel)
  company: CompanyModel;

  @BelongsTo(() => UserModel)
  assignee: UserModel;
}
