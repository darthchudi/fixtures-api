namespace RepositoryErrors {
  export class GenericDBError extends Error {
    constructor(message: string) {
      super(message);
    }
  }

  export class ModelNotFoundError extends Error {
    constructor(message: string) {
      super(message);
    }
  }

  export class DuplicateModelError extends Error {
    constructor(message: string) {
      super(message);
    }
  }
}

export default RepositoryErrors;
