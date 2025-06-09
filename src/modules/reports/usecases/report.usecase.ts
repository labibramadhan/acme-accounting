import { Inject, Injectable } from '@nestjs/common';
import { IReportUsecase } from '../interfaces/usecases/report-usecase.interface';
import { ReportDTO } from '../dto/report.dto';
import { ReportStatusEnum, ReportType } from '@/db/enums/report.enum';
import { IReportYearlyUsecase } from '../interfaces/usecases/report-yearly.usecase.interface';
import { ReportEntity } from '@/db/entities/report.entity';
import { v4 } from 'uuid';
import { IReportRepository } from '../interfaces/repositories/report-repository.interface';
import { plainToInstance } from 'class-transformer';
import { ReportGenerateDTO } from '../dto/report-generate.dto';
import { IReportAccountsUsecase } from '../interfaces/usecases/report-accounts.usecase.interfac';
import { IReportFSUsecase } from '../interfaces/usecases/report-fs.usecase.interfa';
import { ReportResultDTO } from '../dto/report-result.dto';
import { IReportGeneratorUsecase } from '../interfaces/usecases/report-generator.usecase.interface';

@Injectable()
export class ReportUsecase implements IReportUsecase {
  strategy: { [key: string]: IReportGeneratorUsecase } = {};
  constructor(
    @Inject(IReportYearlyUsecase)
    private reportGeneratorYearlyUsecase: IReportYearlyUsecase,
    @Inject(IReportAccountsUsecase)
    private reportGeneratorAccountsUsecase: IReportAccountsUsecase,
    @Inject(IReportFSUsecase)
    private reportGeneratorFSUsecase: IReportFSUsecase,
    @Inject(IReportRepository)
    private reportRepository: IReportRepository,
  ) {
    this.strategy = {
      [ReportType.YEARLY]: this.reportGeneratorYearlyUsecase,
      [ReportType.ACCOUNTS]: this.reportGeneratorAccountsUsecase,
      [ReportType.FINANCIAL_STATEMENT]: this.reportGeneratorFSUsecase,
    };
  }

  async generate(type: ReportType): Promise<ReportDTO> {
    if (!Object.values(ReportType).includes(type)) {
      throw new Error(`Unsupported report type: ${type}`);
    }

    const reportEntity = new ReportEntity();
    reportEntity.id = v4();
    reportEntity.name = `Report ${type}`;
    reportEntity.type = type;
    reportEntity.status = ReportStatusEnum.PENDING;

    await this.reportRepository.create(reportEntity);

    const reportGenerateDTO = new ReportGenerateDTO();
    reportGenerateDTO.reportId = reportEntity.id;
    reportGenerateDTO.name = reportEntity.name;
    reportGenerateDTO.type = type;

    if (!this.strategy[type]) {
      throw new Error(`Report strategy for type ${type} not found`);
    }

    const reportPromise: Promise<ReportResultDTO> =
      this.strategy[type].generate(reportGenerateDTO);

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setImmediate(async () => {
      const reportUpdate = new ReportEntity();
      try {
        const reportResultDTO = await reportPromise;
        reportUpdate.status = reportResultDTO.status;
        reportUpdate.elapsedTimeMs = reportResultDTO.elapsedTimeMs;
      } catch (e) {
        reportUpdate.statusReason = (e as Error)?.message;
      }
      await this.reportRepository.update(reportEntity.id, reportUpdate);
    });

    const reportDTO = plainToInstance(ReportDTO, reportEntity);
    return reportDTO;
  }

  async getReportStatusByReportId(id: string): Promise<ReportDTO> {
    const reportEntity = await this.reportRepository.findOne(id);
    const reportDTO = plainToInstance(ReportDTO, reportEntity);
    return reportDTO;
  }
}
