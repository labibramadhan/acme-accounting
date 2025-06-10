import { ReportStatusEnum, ReportType } from '@/db/enums/report.enum';
import { IsEnum } from 'class-validator';
import { SequelizeEntity } from '@/db/entities/sequelize.entity';

export class ReportDTO extends SequelizeEntity {
  name: string;

  @IsEnum(ReportType)
  type: ReportType;

  fileUrl: string;

  filePath: string;

  @IsEnum(ReportStatusEnum)
  status: ReportStatusEnum;
}
