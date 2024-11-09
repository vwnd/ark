export abstract class Collection<T> {
  cursor: string;
  items: T[];
}

export class Model {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export class ModelCollection extends Collection<Model> {}
