import { TicketEntity } from '@/db/entities/ticket.entity';
import { Transaction } from 'sequelize';

export interface ITicketRepository {
  findAll(): Promise<TicketEntity[]>;
  create(t: Transaction, ticket: TicketEntity): Promise<TicketEntity>;
  resolveAllByCompanyId(t: Transaction, companyId: string): Promise<number>;
}

export const ITicketRepository = Symbol('ITicketRepository');
