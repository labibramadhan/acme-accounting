import { ReportStatusEnum, ReportType } from '@/db/enums/report.enum';

export class ReportResultDTO {
  id: string;
  name: string;
  type: ReportType;
  fileUrl: string;
  filePath: string;
  status: ReportStatusEnum;
  statusReason: string;
  elapsedTimeMs: number;
}
