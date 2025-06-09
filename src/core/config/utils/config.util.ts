import * as yaml from 'js-yaml';
import { readFileSync } from 'fs';
import { join } from 'path';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ConfigDTO } from '../dto/config.dto';

export const loadConfig = (dir: string, filename: string = 'config.yaml') => {
  const rawConfig = yaml.load(
    readFileSync(join(dir, filename), 'utf8'),
  ) as Record<string, any>;

  return validateConfig(rawConfig);
};

export const validateConfig = (config: Record<string, any>) => {
  const validatedConfig = plainToInstance(ConfigDTO, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
};
