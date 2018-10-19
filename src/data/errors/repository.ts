namespace RepositoryErrors {
  export class GenericDBError extends Error {
    code: string;
    constructor(message: string) {
      super(message);
    }
  }

  export class ModelNotFoundError extends Error {
    code: string;
    constructor(message: string) {
      super(message);
    }
  }

  export class DuplicateModelError extends Error {
    code: string;
    constructor(message: string) {
      super(message);
    }
  }
}

export default RepositoryErrors;
