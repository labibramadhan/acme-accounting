import { ReportType } from '@/db/enums/report.enum';

export class ReportGenerateDTO {
  reportId: string;
  name: string;
  type: ReportType;
}
