export interface QueryOptions {
  conditions?: any;
  projections?: any;
  select?: any;
}

export interface Repository<T> {
  all(options: QueryOptions): Promise<T[]>;
  byID(id: string): Promise<T>;
  byQuery(options: QueryOptions): Promise<T>;
  create(attributes: any): Promise<T>;
  delete(id: string): Promise<boolean>;
  update(id: string, data: any): Promise<T>;
}
