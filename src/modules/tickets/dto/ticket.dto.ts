import {
  TicketType,
  TicketStatus,
  TicketCategory,
} from '@/db/enums/ticket.enum';
import { CompanyDTO } from '@/modules/company/dto/company.dto';
import { UserDTO } from '@/modules/user/dto/user.dto';
import { Type } from 'class-transformer';
import { SequelizeEntity } from '@/db/entities/sequelize.entity';

export class TicketDTO extends SequelizeEntity {
  type: TicketType;

  status: TicketStatus;

  category: TicketCategory;

  companyId: string;

  @Type(() => CompanyDTO)
  company?: CompanyDTO;

  assigneeId: string;

  @Type(() => UserDTO)
  assignee?: UserDTO;
}
