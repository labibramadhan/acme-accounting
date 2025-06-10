import { ITicketPersistenceUsecase } from './ticket-persistence-usecase.interface';

export interface ITicketRegAddressChangeUsecase
  extends ITicketPersistenceUsecase {}

export const ITicketRegAddressChangeUsecase = Symbol(
  'ITicketRegAddressChangeUsecase',
);
