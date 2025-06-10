import { CreateTicketDTO } from '../dto/create-ticket.dto';
import { TicketDTO } from '../dto/ticket.dto';
import { ITicketManagementReportUsecase } from '../interfaces/usecases/ticket-managementreport.usecase';
import { RoleEnum } from '@/db/enums/role.enum';
import { TicketCategory, TicketStatus } from '@/db/enums/ticket.enum';
import { ConflictException, Inject } from '@nestjs/common';
import { TicketEntity } from '@/db/entities/ticket.entity';
import { IUserRepository } from '@/modules/user/interfaces/repositories/user-repository.interface';
import { ITicketRepository } from '../interfaces/repositories/ticket-repository.interface';
import { Sequelize } from 'sequelize-typescript';
import { v4 } from 'uuid';
import { transformEntityToDTO } from '@/core/config/utils/transformer.util';

export class TicketManagementReportUsecase
  implements ITicketManagementReportUsecase
{
  constructor(
    @Inject() private sequelize: Sequelize,
    @Inject(ITicketRepository) private ticketRepository: ITicketRepository,
    @Inject(IUserRepository) private userRepository: IUserRepository,
  ) {}

  async create(ticket: CreateTicketDTO): Promise<TicketDTO> {
    const { companyId } = ticket;

    const userRole: RoleEnum = RoleEnum.accountant;
    const category: TicketCategory = TicketCategory.accounting;

    const assignees = await this.userRepository.findAll({
      where: { companyId, role: userRole },
      order: [['createdAt', 'DESC']],
      limit: 2,
    });

    if (!assignees.length)
      throw new ConflictException(
        `Cannot find user with role ${userRole} to create a ticket`,
      );

    const assignee = assignees[0];

    const ticketEntity: TicketEntity = transformEntityToDTO(TicketEntity, {
      id: v4(),
      ...ticket,
      category,
      assigneeId: assignee.id,
      status: TicketStatus.open,
    });

    const trx = await this.sequelize.transaction();
    try {
      const insertedTicket = await this.ticketRepository.create(
        trx,
        ticketEntity,
      );
      const result = transformEntityToDTO(TicketDTO, insertedTicket);
      await trx.commit();
      return result;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}
