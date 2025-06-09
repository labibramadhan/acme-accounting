import { CreateTicketDTO } from '../../dto/create-ticket.dto';
import { TicketDTO } from '../../dto/ticket.dto';

export interface ITicketUsecase {
  findAll(): Promise<TicketDTO[]>;
  createTicket(ticket: CreateTicketDTO): Promise<TicketDTO>;
}

export const ITicketUsecase = Symbol('ITicketUsecase');
