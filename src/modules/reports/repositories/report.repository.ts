import { Injectable } from '@nestjs/common';
import { IReportRepository } from '../interfaces/repositories/report-repository.interface';
import { ReportEntity } from '@/db/entities/report.entity';
import { ReportModel } from '@/db/models/report.model';

@Injectable()
export class ReportRepository implements IReportRepository {
  async findOne(id: string): Promise<ReportEntity | null> {
    const record = await ReportModel.findOne({ where: { id } });
    return record ? record.toJSON() : null;
  }

  async create(report: Partial<ReportEntity>): Promise<ReportEntity> {
    const insertedReport = await ReportModel.create(report);
    return insertedReport.toJSON();
  }

  async update(id: string, update: Partial<ReportEntity>): Promise<boolean> {
    const [affectedRows] = await ReportModel.update(update, { where: { id } });
    if (affectedRows === 0) {
      throw new Error('Update failed, no affected rows');
    }
    return true;
  }
}
