import { InternalServerErrorException } from '@nestjs/common';

export function assertExist<T>(data: T | undefined | null): asserts data is T {
  if (data === undefined || data === null) {
    throw new InternalServerErrorException('not exist');
  }
}
