import { TicketType } from '@/db/enums/ticket.enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateTicketDTO {
  @IsEnum(TicketType)
  @IsString()
  @IsNotEmpty()
  type: TicketType;

  @IsString()
  @IsNotEmpty()
  companyId: string;
}
