import { TicketCategory, TicketStatus, TicketType } from '../enums/ticket.enum';
import { CompanyEntity } from './company.entity';
import { UserEntity } from './user.entity';
import { SequelizeEntity } from './sequelize.entity';

export class TicketEntity extends SequelizeEntity {
  type: TicketType;
  status: TicketStatus;
  category: TicketCategory;

  companyId: string;
  company: CompanyEntity;

  assigneeId: string;
  assignee: UserEntity;
}
