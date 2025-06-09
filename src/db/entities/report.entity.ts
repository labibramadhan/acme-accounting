import { ReportStatusEnum } from '../enums/report.enum';
import { SequelizeEntity } from './sequelize.entity';

export class ReportEntity extends SequelizeEntity {
  name: string;
  type: string;
  fileUrl: string;
  status: ReportStatusEnum;
  statusReason: string;
  elapsedTimeMs: number;
}
