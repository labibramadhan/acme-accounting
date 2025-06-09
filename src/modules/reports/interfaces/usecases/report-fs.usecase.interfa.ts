import { IReportGeneratorUsecase } from './report-generator.usecase.interface';

export interface IReportFSUsecase extends IReportGeneratorUsecase {}

export const IReportFSUsecase = Symbol('IReportFSUsecase');
