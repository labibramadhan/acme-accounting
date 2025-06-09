import { CreateTicketDTO } from '../../dto/create-ticket.dto';
import { TicketDTO } from '../../dto/ticket.dto';

export interface ITicketPersistenceUsecase {
  create(ticket: CreateTicketDTO): Promise<TicketDTO>;
}
