import { ReportGenerateDTO } from '../dto/report-generate.dto';
import { ReportResultDTO } from '../dto/report-result.dto';
import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';
import { ReportStatusEnum } from '@/db/enums/report.enum';
import { Injectable } from '@nestjs/common';
import { IReportYearlyUsecase } from '../interfaces/usecases/report-yearly.usecase.interface';
import readline from 'readline';

@Injectable()
export class ReportYearlyUsecase implements IReportYearlyUsecase {
  async generate(
    reportGenerateDTO: ReportGenerateDTO,
  ): Promise<ReportResultDTO> {
    const start = performance.now();
    const tmpDir = 'tmp';
    const outputFile = 'out/yearly.csv';
    const cashByYear: Record<string, number> = {};
    const files = await fs.promises.readdir(tmpDir);
    const promises: Promise<void>[] = [];
    for (const file of files) {
      if (file.endsWith('.csv')) {
        promises.push(
          (async () => {
            const filePath = path.join(tmpDir, file);
            const fileStream = fs.createReadStream(filePath);

            const rl = readline.createInterface({
              input: fileStream,
              crlfDelay: Infinity,
            });

            for await (const line of rl) {
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
          })(),
        );
      }
    }
    await Promise.all(promises);
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
