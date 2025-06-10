import { ReportEntity } from '@/db/entities/report.entity';

export interface IReportRepository {
  findOne(id: string): Promise<ReportEntity | null>;
  create(report: ReportEntity): Promise<ReportEntity>;
  update(id: string, update: Partial<ReportEntity>): Promise<boolean>;
}

export const IReportRepository = Symbol('IReportRepository');
