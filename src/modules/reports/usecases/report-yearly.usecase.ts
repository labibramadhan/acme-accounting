import { ReportGenerateDTO } from '../dto/report-generate.dto';
import { ReportResultDTO } from '../dto/report-result.dto';
import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';
import { ReportStatusEnum } from '@/db/enums/report.enum';
import { Injectable } from '@nestjs/common';
import { IReportYearlyUsecase } from '../interfaces/usecases/report-yearly.usecase.interface';

@Injectable()
export class ReportYearlyUsecase implements IReportYearlyUsecase {
  async generate(
    reportGenerateDTO: ReportGenerateDTO,
  ): Promise<ReportResultDTO> {
    const start = performance.now();
    const tmpDir = 'tmp';
    const outputFile = 'out/yearly.csv';
    const cashByYear: Record<string, number> = {};
    await fs.promises.readdir(tmpDir).then((files) => {
      files.forEach((file) => {
        if (file.endsWith('.csv') && file !== 'yearly.csv') {
          const lines = fs
            .readFileSync(path.join(tmpDir, file), 'utf-8')
            .trim()
            .split('\n');
          for (const line of lines) {
            const [date, account, , debit, credit] = line.split(',');
            if (account === 'Cash') {
              const year = new Date(date).getFullYear();
              if (!cashByYear[year]) {
                cashByYear[year] = 0;
              }
              cashByYear[year] +=
                parseFloat(String(debit || 0)) -
                parseFloat(String(credit || 0));
            }
          }
        }
      });
    });
    const output = ['Financial Year,Cash Balance'];
    Object.keys(cashByYear)
      .sort()
      .forEach((year) => {
        output.push(`${year},${cashByYear[year].toFixed(2)}`);
      });
    await fs.promises.writeFile(outputFile, output.join('\n'));
    return {
      id: reportGenerateDTO.reportId,
      name: reportGenerateDTO.name,
      type: reportGenerateDTO.type,
      status: ReportStatusEnum.COMPLETED,
      elapsedTimeMs: performance.now() - start,
      fileUrl: outputFile,
      filePath: path.resolve(outputFile),
      statusReason: '',
    };
  }
}
