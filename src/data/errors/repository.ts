namespace RepositoryErrors {
  export class GenericDBError extends Error {
    code: string;
    constructor(message: string) {
      super(message);
      this.code = 'NonRetryableError';
    }
  }

  export class ModelNotFoundError extends Error {
    code: string;
    constructor(message: string) {
      super(message);
      this.code = 'NonRetryableError';
    }
  }

  export class DuplicateModelError extends Error {
    code: string;
    constructor(message: string) {
      super(message);
      this.code = 'NonRetryableError';
    }
  }
}

export default RepositoryErrors;
