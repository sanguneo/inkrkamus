declare module 'dexie' {
  export class Collection<T> {
    first(): Promise<T | undefined>;
    toArray(): Promise<T[]>;
  }

  export class Table<T, TKey = number> {
    count(): Promise<number>;
    get(key: TKey | string): Promise<T | undefined>;
    put(item: T): Promise<TKey>;
    clear(): Promise<void>;
    bulkPut(items: T[]): Promise<void>;
    toArray(): Promise<T[]>;
    where(index: string): {
      equals(value: string): Collection<T>;
    };
    orderBy(index: string): {
      toArray(): Promise<T[]>;
    };
  }

  class Dexie {
    constructor(name: string);
    version(versionNumber: number): {
      stores(schema: Record<string, string>): void;
    };
    transaction(
      mode: 'rw' | 'r',
      ...tablesAndScope: [...unknown[], () => Promise<void>]
    ): Promise<void>;
  }

  export default Dexie;
}
