import { ReportGenerateDTO } from '../../dto/report-generate.dto';
import { ReportResultDTO } from '../../dto/report-result.dto';

export interface IReportGeneratorUsecase {
  generate(generate: ReportGenerateDTO): Promise<ReportResultDTO>;
}
