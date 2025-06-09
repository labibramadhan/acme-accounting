import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { CreateTicketDTO } from '../dto/create-ticket.dto';
import { ITicketUsecase } from '../interfaces/usecases/ticket-usecase.interface';

@Controller('api/v1/tickets')
export class TicketController {
  constructor(@Inject(ITicketUsecase) private ticketUsecase: ITicketUsecase) {}

  @Get()
  async findAll() {
    return this.ticketUsecase.findAll();
  }

  @Post()
  async create(@Body() createTicketDto: CreateTicketDTO) {
    return this.ticketUsecase.createTicket(createTicketDto);
  }
}
