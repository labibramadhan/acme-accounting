import { IReportGeneratorUsecase } from '../interfaces/usecases/report-generator.usecase.interface';
import { ReportGenerateDTO } from '../dto/report-generate.dto';
import { ReportResultDTO } from '../dto/report-result.dto';
import { performance } from 'perf_hooks';
import { Injectable } from '@nestjs/common';
import { ReportStatusEnum } from '@/db/enums/report.enum';
import path from 'path';
import fs from 'fs';
import readline from 'readline';

@Injectable()
export class ReportFSUsecase implements IReportGeneratorUsecase {
  async generate(
    reportGenerateDTO: ReportGenerateDTO,
  ): Promise<ReportResultDTO> {
    const start = performance.now();
    const tmpDir = 'tmp';
    const outputFile = 'out/fs.csv';
    const categories = {
      'Income Statement': {
        Revenues: ['Sales Revenue'],
        Expenses: [
          'Cost of Goods Sold',
          'Salaries Expense',
          'Rent Expense',
          'Utilities Expense',
          'Interest Expense',
          'Tax Expense',
        ],
      },
      'Balance Sheet': {
        Assets: [
          'Cash',
          'Accounts Receivable',
          'Inventory',
          'Fixed Assets',
          'Prepaid Expenses',
        ],
        Liabilities: [
          'Accounts Payable',
          'Loan Payable',
          'Sales Tax Payable',
          'Accrued Liabilities',
          'Unearned Revenue',
          'Dividends Payable',
        ],
        Equity: ['Common Stock', 'Retained Earnings'],
      },
    };
    const balances: Record<string, number> = {};
    for (const section of Object.values(categories)) {
      for (const group of Object.values(section)) {
        for (const account of group) {
          balances[account] = 0;
        }
      }
    }
    const promises: Promise<void>[] = [];
    const files = await fs.promises.readdir(tmpDir);
    for (const file of files) {
      if (file.endsWith('.csv') && file !== 'fs.csv') {
        promises.push(
          (async () => {
            const filePath = path.join(tmpDir, file);
            const fileStream = fs.createReadStream(filePath);

            const rl = readline.createInterface({
              input: fileStream,
              crlfDelay: Infinity,
            });

            for await (const line of rl) {
              const [, account, , debit, credit] = line.split(',');

              if (Object.prototype.hasOwnProperty.call(balances, account)) {
                balances[account] +=
                  parseFloat(String(debit || 0)) -
                  parseFloat(String(credit || 0));
              }
            }
          })(),
        );
      }
    }
    await Promise.all(promises);

    const output: string[] = [];
    output.push('Basic Financial Statement');
    output.push('');
    output.push('Income Statement');
    let totalRevenue = 0;
    let totalExpenses = 0;
    for (const account of categories['Income Statement']['Revenues']) {
      const value = balances[account] || 0;
      output.push(`${account},${value.toFixed(2)}`);
      totalRevenue += value;
    }
    for (const account of categories['Income Statement']['Expenses']) {
      const value = balances[account] || 0;
      output.push(`${account},${value.toFixed(2)}`);
      totalExpenses += value;
    }
    output.push(`Net Income,${(totalRevenue - totalExpenses).toFixed(2)}`);
    output.push('');
    output.push('Balance Sheet');
    let totalAssets = 0;
    let totalLiabilities = 0;
    let totalEquity = 0;
    output.push('Assets');
    for (const account of categories['Balance Sheet']['Assets']) {
      const value = balances[account] || 0;
      output.push(`${account},${value.toFixed(2)}`);
      totalAssets += value;
    }
    output.push(`Total Assets,${totalAssets.toFixed(2)}`);
    output.push('');
    output.push('Liabilities');
    for (const account of categories['Balance Sheet']['Liabilities']) {
      const value = balances[account] || 0;
      output.push(`${account},${value.toFixed(2)}`);
      totalLiabilities += value;
    }
    output.push(`Total Liabilities,${totalLiabilities.toFixed(2)}`);
    output.push('');
    output.push('Equity');
    for (const account of categories['Balance Sheet']['Equity']) {
      const value = balances[account] || 0;
      output.push(`${account},${value.toFixed(2)}`);
      totalEquity += value;
    }
    output.push(
      `Retained Earnings (Net Income),${(totalRevenue - totalExpenses).toFixed(2)}`,
    );
    totalEquity += totalRevenue - totalExpenses;
    output.push(`Total Equity,${totalEquity.toFixed(2)}`);
    output.push('');
    output.push(
      `Assets = Liabilities + Equity, ${totalAssets.toFixed(2)} = ${(totalLiabilities + totalEquity).toFixed(2)}`,
    );
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
