import { TicketEntity } from '@/db/entities/ticket.entity';
import { ITicketRepository } from '../interfaces/repositories/ticket-repository.interface';
import { TicketModel } from '@/db/models/ticket.model';
import { CompanyModel } from '@/db/models/company.model';
import { UserModel } from '@/db/models/user.model';
import { Injectable } from '@nestjs/common';
import { TicketStatus } from '@/db/enums/ticket.enum';
import { Transaction } from 'sequelize';

@Injectable()
export class TicketRepository implements ITicketRepository {
  constructor() {}

  async findAll(): Promise<TicketEntity[]> {
    return TicketModel.findAll({
      plain: true,
      include: [CompanyModel, UserModel],
    });
  }

  async create(t: Transaction, ticket: Partial<TicketEntity>) {
    const insertedTicket = await TicketModel.create(ticket, {
      transaction: t,
    });
    return insertedTicket.toJSON<TicketEntity>();
  }

  async resolveAllByCompanyId(
    t: Transaction,
    companyId: string,
  ): Promise<number> {
    const updatedTickets = await TicketModel.update(
      {
        status: TicketStatus.resolved,
      },
      {
        where: {
          companyId,
        },
        transaction: t,
      },
    );

    return updatedTickets[0];
  }
}
