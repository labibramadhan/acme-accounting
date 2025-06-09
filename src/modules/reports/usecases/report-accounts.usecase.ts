import { ReportGenerateDTO } from '../dto/report-generate.dto';
import { ReportResultDTO } from '../dto/report-result.dto';
import { performance } from 'perf_hooks';
import { Injectable } from '@nestjs/common';
import { ReportStatusEnum } from '@/db/enums/report.enum';
import path from 'path';
import { IReportAccountsUsecase } from '../interfaces/usecases/report-accounts.usecase.interfac';
import fs from 'fs';

@Injectable()
export class ReportAccountsUsecase implements IReportAccountsUsecase {
  async generate(
    reportGenerateDTO: ReportGenerateDTO,
  ): Promise<ReportResultDTO> {
    const start = performance.now();
    const tmpDir = 'tmp';
    const outputFile = 'out/accounts.csv';
    const accountBalances: Record<string, number> = {};
    await fs.promises.readdir(tmpDir).then((files) => {
      files.forEach((file) => {
        if (file.endsWith('.csv')) {
          const lines = fs
            .readFileSync(path.join(tmpDir, file), 'utf-8')
            .trim()
            .split('\n');
          for (const line of lines) {
            const [, account, , debit, credit] = line.split(',');
            if (!accountBalances[account]) {
              accountBalances[account] = 0;
            }
            accountBalances[account] +=
              parseFloat(String(debit || 0)) - parseFloat(String(credit || 0));
          }
        }
      });
    });
    const output = ['Account,Balance'];
    for (const [account, balance] of Object.entries(accountBalances)) {
      output.push(`${account},${balance.toFixed(2)}`);
    }
    fs.writeFileSync(outputFile, output.join('\n'));

    const end = performance.now();
    const duration = (end - start) / 1000;
    return {
      id: reportGenerateDTO.reportId,
      name: reportGenerateDTO.name,
      type: reportGenerateDTO.type,
      status: ReportStatusEnum.COMPLETED,
      elapsedTimeMs: duration,
      fileUrl: outputFile,
      filePath: path.resolve(outputFile),
      statusReason: '',
    };
  }
}
