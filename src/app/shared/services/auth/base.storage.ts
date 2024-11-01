/* eslint-disable @typescript-eslint/no-unused-vars */

export class BaseStorage {
  get(key: string): string | undefined {
    return undefined;
  }

  set(key: string, value: string | number | boolean, expires?: Date): void {}

  delete(key: string): void {}
}

export class InternalStorage extends BaseStorage {}

export class SDKStorage extends BaseStorage {}
