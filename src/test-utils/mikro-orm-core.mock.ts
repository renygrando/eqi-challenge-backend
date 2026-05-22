export class EntityManager {
  async flush(): Promise<void> {
    return;
  }
}

export class EntityRepository<T> {
  create(input: Partial<T>): T {
    return input as T;
  }

  async findAll(): Promise<T[]> {
    return [];
  }
}
