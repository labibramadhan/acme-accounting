import { ITicketPersistenceUsecase } from './ticket-persistence-usecase.interface';

export interface ITicketManagementReportUsecase
  extends ITicketPersistenceUsecase {}

export const ITicketManagementReportUsecase = Symbol(
  'ITicketManagementReportUsecase',
);
