import { assertExist } from 'src/common/assertExist';

export const findEnvByKey = (key: string): string => {
  const value = process.env[key];
  assertExist(value);

  return value;
};
