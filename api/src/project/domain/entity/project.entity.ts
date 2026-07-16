export class Project {
  private constructor(
    public readonly id: string | undefined,
    public readonly name: string,
    public readonly description: string,
    public readonly createdById: string,
  ) {}

  static create(name: string, description: string | undefined, createdById: string): Project {
  if (!name?.trim()) throw new Error('Name is required');
  return new Project(undefined, name.trim(), description ?? '', createdById);
}

  static restore(id: string, name: string, description: string, createdById: string): Project {
    return new Project(id, name, description, createdById);
  }
}