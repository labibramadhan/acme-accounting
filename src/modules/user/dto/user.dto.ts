import { RoleEnum } from '@/db/enums/role.enum';
import { CompanyDTO } from '@/modules/company/dto/company.dto';
import { Type } from 'class-transformer';

export class UserDTO {
  id: string;
  name: string;
  role: RoleEnum;

  companyId: string;

  @Type(() => CompanyDTO)
  company: CompanyDTO;
}
