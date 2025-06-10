import { Controller, Get, HttpCode, Inject, Param, Post } from '@nestjs/common';
import { IReportUsecase } from '../interfaces/usecases/report-usecase.interface';
import { ReportType } from '@/db/enums/report.enum';

@Controller('api/v1/reports')
export class ReportController {
  constructor(@Inject(IReportUsecase) private reportUsecase: IReportUsecase) {}

  @Get(':id/status')
  async getReportStatusByReportId(@Param('id') id: string) {
    return this.reportUsecase.getReportStatusByReportId(id);
  }

  @Post()
  @HttpCode(201)
  async generateAll() {
    const reportAccount = await this.reportUsecase.generate(
      ReportType.ACCOUNTS,
    );
    const reportYearly = await this.reportUsecase.generate(ReportType.YEARLY);
    const reportFS = await this.reportUsecase.generate(
      ReportType.FINANCIAL_STATEMENT,
    );
    return { reportAccount, reportYearly, reportFS };
  }

  @Post('accounts')
  @HttpCode(201)
  async generateAccounts() {
    const reportAccount = await this.reportUsecase.generate(
      ReportType.ACCOUNTS,
    );
    return reportAccount;
  }

  @Post('yearly')
  @HttpCode(201)
  async generateYearly() {
    const reportYearly = await this.reportUsecase.generate(ReportType.YEARLY);
    return reportYearly;
  }

  @Post('fs')
  @HttpCode(201)
  async generateFS() {
    const reportFS = await this.reportUsecase.generate(
      ReportType.FINANCIAL_STATEMENT,
    );
    return reportFS;
  }
}
