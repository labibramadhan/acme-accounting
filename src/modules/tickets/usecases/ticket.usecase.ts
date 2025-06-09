import { Inject, Injectable } from '@nestjs/common';
import { ITicketUsecase } from '../interfaces/usecases/ticket-usecase.interface';
import { CreateTicketDTO } from '../dto/create-ticket.dto';
import { TicketDTO } from '../dto/ticket.dto';
import { TicketType } from '@/db/enums/ticket.enum';
import { ITicketRepository } from '../interfaces/repositories/ticket-repository.interface';
import { plainToInstance } from 'class-transformer';
import { IUserRepository } from '@/modules/user/interfaces/repositories/user-repository.interface';
import { ITicketStrikeOffUsecase } from '../interfaces/usecases/ticket-strikeoff.usecase';
import { ITicketManagementReportUsecase } from '../interfaces/usecases/ticket-managementreport.usecase';
import { ITicketRegAddressChangeUsecase } from '../interfaces/usecases/ticket-regaddresschange.usecase';
import { ITicketPersistenceUsecase } from '../interfaces/usecases/ticket-persistence-usecase.interface';

@Injectable()
export class TicketUsecase implements ITicketUsecase {
  strategy: { [key: string]: ITicketPersistenceUsecase } = {};

  constructor(
    @Inject(ITicketRepository) private ticketRepository: ITicketRepository,
    @Inject(IUserRepository) private userRepository: IUserRepository,
    @Inject(ITicketStrikeOffUsecase)
    private ticketStrikeOffUsecase: ITicketStrikeOffUsecase,
    @Inject(ITicketRegAddressChangeUsecase)
    private ticketRegAddressChangeUsecase: ITicketRegAddressChangeUsecase,
    @Inject(ITicketManagementReportUsecase)
    private ticketManagementReportUsecase: ITicketManagementReportUsecase,
  ) {
    this.strategy = {
      [TicketType.strikeOff]: this.ticketStrikeOffUsecase,
      [TicketType.registrationAddressChange]:
        this.ticketRegAddressChangeUsecase,
      [TicketType.managementReport]: this.ticketManagementReportUsecase,
    };
  }

  async findAll() {
    const tickets = await this.ticketRepository.findAll();
    const ticketDTOs = plainToInstance(TicketDTO, tickets);
    return ticketDTOs;
  }

  async createTicket(ticket: CreateTicketDTO): Promise<TicketDTO> {
    const { type } = ticket;

    if (!Object.values(TicketType).includes(type)) {
      throw new Error(`Unsupported ticket type: ${type}`);
    }

    if (!this.strategy[type]) {
      throw new Error(`Ticket strategy for type ${type} not found`);
    }

    const result = await this.strategy[type].create(ticket);

    return result;
  }
}
