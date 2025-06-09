import { TicketEntity } from '@/db/entities/ticket.entity';
import { RoleEnum } from '@/db/enums/role.enum';
import { TicketCategory, TicketStatus } from '@/db/enums/ticket.enum';
import { ConflictException, Inject } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateTicketDTO } from '../dto/create-ticket.dto';
import { TicketDTO } from '../dto/ticket.dto';
import { ITicketStrikeOffUsecase } from '../interfaces/usecases/ticket-strikeoff.usecase';
import { IUserRepository } from '@/modules/user/interfaces/repositories/user-repository.interface';
import { ITicketRepository } from '../interfaces/repositories/ticket-repository.interface';
import { Sequelize } from 'sequelize-typescript';
import { v4 } from 'uuid';

export class TicketStrikeOffUsecase implements ITicketStrikeOffUsecase {
  constructor(
    @Inject() private sequelize: Sequelize,
    @Inject(ITicketRepository) private ticketRepository: ITicketRepository,
    @Inject(IUserRepository) private userRepository: IUserRepository,
  ) {}

  async create(ticket: CreateTicketDTO): Promise<TicketDTO> {
    const { companyId } = ticket;

    const userRole: RoleEnum = RoleEnum.director;
    const category: TicketCategory = TicketCategory.management;

    const assignees = await this.userRepository.findAll({
      where: { companyId, role: userRole },
      order: [['createdAt', 'DESC']],
      limit: 2,
    });

    if (!assignees.length)
      throw new ConflictException(
        `Cannot find user with role ${userRole} to create a ticket`,
      );

    if (assignees.length > 1)
      throw new ConflictException(
        `Multiple users with role ${userRole}. Cannot create a ticket`,
      );

    const assignee = assignees[0];

    const ticketEntity: TicketEntity = plainToInstance(TicketEntity, {
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
      const result = plainToInstance(TicketDTO, insertedTicket);
      await this.ticketRepository.resolveAllByCompanyId(trx, companyId);
      await trx.commit();
      return result;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}
