import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CompanyModel } from '@/db/models/company.model';
import { TicketModel } from '@/db/models/ticket.model';
import { UserModel } from '@/db/models/user.model';
import { ReportModel } from '@/db/models/report.model';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          dialect: configService.getOrThrow('database.dialect'),
          host: configService.getOrThrow('database.host'),
          port: configService.getOrThrow('database.port'),
          username: configService.getOrThrow('database.username'),
          password: configService.getOrThrow('database.password'),
          database: configService.getOrThrow('database.database'),
          models: [CompanyModel, UserModel, TicketModel, ReportModel],
        };
      },
    }),
  ],
})
export class DbModule {}
