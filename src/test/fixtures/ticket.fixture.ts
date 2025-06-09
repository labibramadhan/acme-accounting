import { TicketEntity } from '@/db/entities/ticket.entity';
import {
  TicketType,
  TicketStatus,
  TicketCategory,
} from '@/db/enums/ticket.enum';
import { faker } from '@faker-js/faker';
import { v4 } from 'uuid';

export class TicketFixture {
  static create(ticket?: Partial<TicketEntity>) {
    const ticketEntity = new TicketEntity();
    ticketEntity.id = v4();
    ticketEntity.companyId = v4();
    ticketEntity.assigneeId = v4();
    ticketEntity.type = faker.helpers.enumValue(TicketType);
    ticketEntity.status = faker.helpers.enumValue(TicketStatus);
    ticketEntity.category = faker.helpers.enumValue(TicketCategory);

    Object.assign(ticketEntity, ticket);

    return ticketEntity;
  }

  static createMany(howMany: number = 10, ticket?: Partial<TicketEntity>) {
    return Array.from({ length: howMany }, () => this.create(ticket));
  }
}
