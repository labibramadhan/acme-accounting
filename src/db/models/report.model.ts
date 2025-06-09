import {
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ReportEntity } from '../entities/report.entity';
import { ReportStatusEnum, ReportType } from '../enums/report.enum';

@Table({ tableName: 'reports' })
export class ReportModel extends Model implements ReportEntity {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column
  name: string;

  @Column
  type: ReportType;

  @Column
  fileUrl: string;

  @Column
  filePath: string;

  @Column
  status: ReportStatusEnum;

  @Column
  statusReason: string;

  @Column
  elapsedTimeMs: number;
}
