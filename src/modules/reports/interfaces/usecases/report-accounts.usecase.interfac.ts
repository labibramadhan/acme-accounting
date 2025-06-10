import { IReportGeneratorUsecase } from './report-generator.usecase.interface';

export interface IReportAccountsUsecase extends IReportGeneratorUsecase {}

export const IReportAccountsUsecase = Symbol('IReportAccountsUsecase');
