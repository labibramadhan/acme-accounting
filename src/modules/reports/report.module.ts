import { Module } from '@nestjs/common';
import { ReportController } from './controllers/report.controller';
import { IReportRepository } from './interfaces/repositories/report-repository.interface';
import { IReportYearlyUsecase } from './interfaces/usecases/report-yearly.usecase.interface';
import { ReportRepository } from './repositories/report.repository';
import { ReportYearlyUsecase } from './usecases/report-yearly.usecase';
import { IReportUsecase } from './interfaces/usecases/report-usecase.interface';
import { ReportUsecase } from './usecases/report.usecase';
import { IReportAccountsUsecase } from './interfaces/usecases/report-accounts.usecase.interfac';
import { IReportFSUsecase } from './interfaces/usecases/report-fs.usecase.interfa';
import { ReportAccountsUsecase } from './usecases/report-accounts.usecase';
import { ReportFSUsecase } from './usecases/report-fs.usecase';
@Module({
  controllers: [ReportController],
  providers: [
    {
      provide: IReportRepository,
      useClass: ReportRepository,
    },
    {
      provide: IReportUsecase,
      useClass: ReportUsecase,
    },
    {
      provide: IReportYearlyUsecase,
      useClass: ReportYearlyUsecase,
    },
    {
      provide: IReportAccountsUsecase,
      useClass: ReportAccountsUsecase,
    },
    {
      provide: IReportFSUsecase,
      useClass: ReportFSUsecase,
    },
  ],
  exports: [
    IReportRepository,
    IReportUsecase,
    IReportYearlyUsecase,
    IReportAccountsUsecase,
    IReportFSUsecase,
  ],
})
export class ReportModule {}
