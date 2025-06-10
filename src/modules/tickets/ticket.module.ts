import { Module } from '@nestjs/common';
import { TicketController } from './controllers/ticket.controller';
import { TicketUsecase } from './usecases/ticket.usecase';
import { ITicketRepository } from './interfaces/repositories/ticket-repository.interface';
import { TicketRepository } from './repositories/ticket.repository';
import { ITicketUsecase } from './interfaces/usecases/ticket-usecase.interface';
import { UserModule } from '../user/user.module';
import { ITicketManagementReportUsecase } from './interfaces/usecases/ticket-managementreport.usecase';
import { ITicketRegAddressChangeUsecase } from './interfaces/usecases/ticket-regaddresschange.usecase';
import { ITicketStrikeOffUsecase } from './interfaces/usecases/ticket-strikeoff.usecase';
import { TicketManagementReportUsecase } from './usecases/ticket-managementreport.usecase';
import { TicketRegAddressChangeUsecase } from './usecases/ticket-regaddresschange.usecase';
import { TicketStrikeOffUsecase } from './usecases/ticket-strikeoff.usecase';

@Module({
  imports: [UserModule],
  controllers: [TicketController],
  providers: [
    {
      provide: ITicketRepository,
      useClass: TicketRepository,
    },
    {
      provide: ITicketUsecase,
      useClass: TicketUsecase,
    },
    {
      provide: ITicketManagementReportUsecase,
      useClass: TicketManagementReportUsecase,
    },
    {
      provide: ITicketRegAddressChangeUsecase,
      useClass: TicketRegAddressChangeUsecase,
    },
    {
      provide: ITicketStrikeOffUsecase,
      useClass: TicketStrikeOffUsecase,
    },
  ],
  exports: [ITicketRepository, ITicketUsecase],
})
export class TicketModule {}
