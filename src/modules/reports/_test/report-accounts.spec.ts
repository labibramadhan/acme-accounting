import { TestingModule, Test } from '@nestjs/testing';
import { ReportController } from '../controllers/report.controller';
import { IReportUsecase } from '../interfaces/usecases/report-usecase.interface';
import { ReportUsecase } from '../usecases/report.usecase';
import { IReportRepository } from '../interfaces/repositories/report-repository.interface';
import { ReportRepository } from '../repositories/report.repository';
import { ReportYearlyUsecase } from '../usecases/report-yearly.usecase';
import { IReportYearlyUsecase } from '../interfaces/usecases/report-yearly.usecase.interface';
import { ReportEntity } from '@/db/entities/report.entity';
import { ReportType, ReportStatusEnum } from '@/db/enums/report.enum';
import { IReportAccountsUsecase } from '../interfaces/usecases/report-accounts.usecase.interfac';
import { IReportFSUsecase } from '../interfaces/usecases/report-fs.usecase.interfa';
import { ReportAccountsUsecase } from '../usecases/report-accounts.usecase';
import { ReportFSUsecase } from '../usecases/report-fs.usecase';
import fs from 'fs';

describe('Report - Type: Accounts', () => {
  let controller: ReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [
        {
          provide: IReportUsecase,
          useClass: ReportUsecase,
        },
        {
          provide: IReportRepository,
          useClass: ReportRepository,
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
    }).compile();

    controller = module.get<ReportController>(ReportController);
  });

  it(
    'should generate an accounts report in the background',
    async () => {
      const spyReportCreate = jest.spyOn(ReportRepository.prototype, 'create');
      const spyReportUpdate = jest.spyOn(ReportRepository.prototype, 'update');
      const spyReportGeneratorAccountsGenerate = jest.spyOn(
        ReportAccountsUsecase.prototype,
        'generate',
      );

      spyReportCreate.mockImplementation((param) =>
        Promise.resolve(param as ReportEntity),
      );

      spyReportUpdate.mockResolvedValue(true);

      const resultDTO = await controller.generateAccounts();
      expect(resultDTO.status).toBe(ReportStatusEnum.PENDING);

      expect(spyReportCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          type: ReportType.ACCOUNTS,
          status: ReportStatusEnum.PENDING,
        }),
      );

      // simulate wait for report generation finished
      await new Promise((resolve) => setTimeout(resolve, 10 * 1000));

      expect(spyReportUpdate).toHaveBeenCalledWith(
        resultDTO.id,
        expect.objectContaining({
          status: ReportStatusEnum.COMPLETED,
        }),
      );

      const generateResultDTO =
        await spyReportGeneratorAccountsGenerate.mock.results[0].value;
      expect(fs.existsSync(generateResultDTO.filePath)).toBe(true);
    },
    3 * 60 * 1000,
  );
});
