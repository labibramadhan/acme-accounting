import { TicketController } from '@/modules/tickets/controllers/ticket.controller';
import { TestingModule, Test } from '@nestjs/testing';
import { CreateTicketDTO } from '@/modules/tickets/dto/create-ticket.dto';
import {
  TicketCategory,
  TicketStatus,
  TicketType,
} from '@/db/enums/ticket.enum';
import { ITicketUsecase } from '../interfaces/usecases/ticket-usecase.interface';
import { TicketUsecase } from '../usecases/ticket.usecase';
import { ITicketRepository } from '../interfaces/repositories/ticket-repository.interface';
import { TicketRepository } from '../repositories/ticket.repository';
import { TicketEntity } from '@/db/entities/ticket.entity';
import { UserEntity } from '@/db/entities/user.entity';
import { UserFixture } from '@test/fixtures/user.fixture';
import { UserRepository } from '@/modules/user/repositories/user.repository';
import { IUserRepository } from '@/modules/user/interfaces/repositories/user-repository.interface';
import { RoleEnum } from '@/db/enums/role.enum';
import { CompanyEntity } from '@/db/entities/company.entity';
import { CompanyFixture } from '@/test/fixtures/company.fixture';
import { ITicketManagementReportUsecase } from '../interfaces/usecases/ticket-managementreport.usecase';
import { ITicketRegAddressChangeUsecase } from '../interfaces/usecases/ticket-regaddresschange.usecase';
import { ITicketStrikeOffUsecase } from '../interfaces/usecases/ticket-strikeoff.usecase';
import { TicketManagementReportUsecase } from '../usecases/ticket-managementreport.usecase';
import { TicketRegAddressChangeUsecase } from '../usecases/ticket-regaddresschange.usecase';
import { TicketStrikeOffUsecase } from '../usecases/ticket-strikeoff.usecase';
import { Sequelize } from 'sequelize-typescript';

describe('Tickets - Type: Registration Address Change', () => {
  let controller: TicketController;
  let userCorporateSecretary: UserEntity;
  let userDirector: UserEntity;
  let company: CompanyEntity;

  let mockTrx: { commit: jest.Mock; rollback: jest.Mock };
  let sequelize: { transaction: jest.Mock };

  beforeEach(async () => {
    mockTrx = { commit: jest.fn(), rollback: jest.fn() };
    sequelize = { transaction: jest.fn().mockResolvedValue(mockTrx) };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketController],
      providers: [
        {
          provide: ITicketUsecase,
          useClass: TicketUsecase,
        },
        {
          provide: ITicketStrikeOffUsecase,
          useClass: TicketStrikeOffUsecase,
        },
        {
          provide: ITicketManagementReportUsecase,
          useClass: TicketManagementReportUsecase,
        },
        {
          provide: ITicketRegAddressChangeUsecase,
          useClass: TicketRegAddressChangeUsecase,
        },
        {
          provide: ITicketRepository,
          useClass: TicketRepository,
        },
        {
          provide: IUserRepository,
          useClass: UserRepository,
        },
        {
          provide: Sequelize,
          useValue: sequelize,
        },
      ],
    }).compile();

    controller = module.get<TicketController>(TicketController);
    userCorporateSecretary = UserFixture.create({
      role: RoleEnum.corporateSecretary,
    });
    userDirector = UserFixture.create({
      role: RoleEnum.director,
    });
    company = CompanyFixture.create();
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('create ticket', async () => {
      const spyTicketCreate = jest.spyOn(TicketRepository.prototype, 'create');
      const spyUserFindAll = jest.spyOn(UserRepository.prototype, 'findAll');
      spyUserFindAll.mockResolvedValue([userCorporateSecretary]);

      const ticket = new CreateTicketDTO();
      ticket.type = TicketType.registrationAddressChange;
      ticket.companyId = company.id;

      spyTicketCreate.mockImplementation((_, ticket) =>
        Promise.resolve(ticket as TicketEntity),
      );

      const result = await controller.create(ticket);

      expect(spyTicketCreate).toHaveBeenCalledWith(
        mockTrx,
        expect.objectContaining({
          id: expect.any(String),
          type: ticket.type,
          companyId: ticket.companyId,
          category: TicketCategory.corporate,
          assigneeId: userCorporateSecretary.id,
          status: TicketStatus.open,
        }),
      );

      expect(result.id).toBeDefined();
      expect(result.assigneeId).toEqual(userCorporateSecretary.id);
      expect(result.companyId).toEqual(company.id);
      expect(result.category).toEqual(TicketCategory.corporate);
      expect(result.status).toEqual(TicketStatus.open);
    });
    it('if there are multiple corporateSecretary, throw', async () => {
      const spyUserFindAll = jest.spyOn(UserRepository.prototype, 'findAll');
      spyUserFindAll.mockResolvedValue([
        userCorporateSecretary,
        userCorporateSecretary,
      ]);

      const ticket = new CreateTicketDTO();
      ticket.type = TicketType.registrationAddressChange;
      ticket.companyId = company.id;

      expect(() => controller.create(ticket)).rejects.toThrow(
        `Multiple users with role ${RoleEnum.corporateSecretary}. Cannot create a ticket`,
      );
    });
    it('if no corporateSecretary, assign to a director', async () => {
      const spyTicketCreate = jest.spyOn(TicketRepository.prototype, 'create');
      const spyUserFindAll = jest.spyOn(UserRepository.prototype, 'findAll');
      spyUserFindAll
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([userDirector]);

      const ticket = new CreateTicketDTO();
      ticket.type = TicketType.registrationAddressChange;
      ticket.companyId = company.id;

      spyTicketCreate.mockImplementation((_, ticket) =>
        Promise.resolve(ticket as TicketEntity),
      );

      const result = await controller.create(ticket);

      expect(spyTicketCreate).toHaveBeenCalledWith(
        mockTrx,
        expect.objectContaining({
          id: expect.any(String),
          type: ticket.type,
          companyId: ticket.companyId,
          category: TicketCategory.corporate,
          assigneeId: userDirector.id,
          status: TicketStatus.open,
        }),
      );

      expect(result.id).toBeDefined();
      expect(result.assigneeId).toEqual(userDirector.id);
      expect(result.companyId).toEqual(company.id);
      expect(result.category).toEqual(TicketCategory.corporate);
      expect(result.status).toEqual(TicketStatus.open);
    });
    it('if no corporateSecretary but there are multiple directors, throw', async () => {
      const spyUserFindAll = jest.spyOn(UserRepository.prototype, 'findAll');
      spyUserFindAll
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([userDirector, userDirector]);

      const ticket = new CreateTicketDTO();
      ticket.type = TicketType.registrationAddressChange;
      ticket.companyId = company.id;

      expect(() => controller.create(ticket)).rejects.toThrow(
        `Multiple users with role ${RoleEnum.director}. Cannot create a ticket`,
      );
    });
    it('throw if there is no user to assign', () => {
      const spyUserFindAll = jest.spyOn(UserRepository.prototype, 'findAll');
      spyUserFindAll.mockResolvedValue([]);

      const ticket = new CreateTicketDTO();
      ticket.type = TicketType.registrationAddressChange;
      ticket.companyId = company.id;

      expect(() => controller.create(ticket)).rejects.toThrow(
        `Cannot find user with role ${RoleEnum.corporateSecretary} or ${RoleEnum.director} to create a ticket`,
      );
    });
  });
});
