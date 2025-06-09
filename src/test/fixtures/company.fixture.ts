import { CompanyEntity } from '@/db/entities/company.entity';
import { faker } from '@faker-js/faker';
import { v4 } from 'uuid';

export class CompanyFixture {
  static create(company?: Partial<CompanyEntity>) {
    const companyEntity = new CompanyEntity();
    companyEntity.id = v4();
    companyEntity.name = faker.person.fullName();

    Object.assign(companyEntity, company);

    return companyEntity;
  }

  static createMany(howMany: number = 10, company?: Partial<CompanyEntity>) {
    return Array.from({ length: howMany }, () => this.create(company));
  }
}
