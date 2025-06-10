import {
  ClassConstructor,
  ClassTransformOptions,
  plainToInstance,
} from 'class-transformer';

function baseTransform<T, V>(
  cls: ClassConstructor<T>,
  plain: V | V[],
  options?: ClassTransformOptions,
): T | T[] {
  return plainToInstance(cls, plain, {
    excludeExtraneousValues: false,
    ...options,
  });
}
export const transformEntityToDTO = <T, V>(
  cls: ClassConstructor<T>,
  entity: V,
  options?: ClassTransformOptions,
): T => baseTransform(cls, entity, options) as T;

export const transformEntitiesToDTO = <T, V>(
  cls: ClassConstructor<T>,
  entities: V[],
  options?: ClassTransformOptions,
): T[] => baseTransform(cls, entities, options) as T[];

export const transformPlainToDTO = <T, V>(
  cls: ClassConstructor<T>,
  plain: V,
  options?: ClassTransformOptions,
): T => baseTransform(cls, plain, options) as T;

export const transformPlainsToDTO = <T, V>(
  cls: ClassConstructor<T>,
  plains: V[],
  options?: ClassTransformOptions,
): T[] => baseTransform(cls, plains, options) as T[];

export const transformDTOToEntity = <T, V>(
  cls: ClassConstructor<T>,
  plains: V,
  options?: ClassTransformOptions,
): T => baseTransform(cls, plains, options) as T;

export const transformDTOsToEntity = <T, V>(
  cls: ClassConstructor<T>,
  plains: V[],
  options?: ClassTransformOptions,
): T[] => baseTransform(cls, plains, options) as T[];

export const transformPlainToEntity = <T, V>(
  cls: ClassConstructor<T>,
  plains: V,
  options?: ClassTransformOptions,
): T => baseTransform(cls, plains, options) as T;

export const transformPlainsToEntity = <T, V>(
  cls: ClassConstructor<T>,
  plains: V[],
  options?: ClassTransformOptions,
): T[] => baseTransform(cls, plains, options) as T[];
