import { IReportGeneratorUsecase } from './report-generator.usecase.interface';

export interface IReportYearlyUsecase extends IReportGeneratorUsecase {}

export const IReportYearlyUsecase = Symbol('IReportYearlyUsecase');
