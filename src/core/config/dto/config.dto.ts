import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Config } from 'sequelize';

class ConfigDatabase implements Partial<Config> {
  @IsNotEmpty()
  dialect: string;

  @IsNotEmpty()
  host: string;

  @IsNotEmpty()
  port: string;

  @IsNotEmpty()
  username: string;

  password: string;

  @IsNotEmpty()
  database: string;
}

export class ConfigDTO {
  @ValidateNested()
  database: ConfigDatabase;
}
