import { ITicketPersistenceUsecase } from './ticket-persistence-usecase.interface';

export interface ITicketStrikeOffUsecase extends ITicketPersistenceUsecase {}

export const ITicketStrikeOffUsecase = Symbol('ITicketStrikeOffUsecase');
