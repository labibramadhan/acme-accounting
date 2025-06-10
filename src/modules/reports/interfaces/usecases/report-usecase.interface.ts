import { ReportType } from '@/db/enums/report.enum';
import { ReportDTO } from '../../dto/report.dto';

export interface IReportUsecase {
  generate(type: ReportType): Promise<ReportDTO>;
  getReportStatusByReportId(id: string): Promise<ReportDTO>;
}

export const IReportUsecase = Symbol('IReportUsecase');
