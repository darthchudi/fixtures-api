import joi, { Root } from 'joi';
import joiPhoneValidator from 'joi-phone-number';
import { ValidationResponse } from './index';

export default abstract class BaseValidator<T> {
  joi: Root;

  constructor() {
    this.joi = joi.extend(joiPhoneValidator);
  }

  /**
   * @param validationErrors The array of validaton errors returned from a Joi validation
   * @returns An object containing the messages from each validation error
   */
  protected getValidationErrorMessage(validationErrors: any[]): any {
    const errorResponse = {};
    validationErrors.forEach(validationError => {
      errorResponse[validationError.path[0]] = validationError.message;
    });
    return errorResponse;
  }

  //Validates a payload against a Joi schema
  validate<U = T>(
    body: any,
    schema: joi.Schema,
    options: joi.ValidationOptions
  ): ValidationResponse<U> {
    const result = this.joi.validate(body, schema, {
      abortEarly: false,
      stripUnknown: { objects: true },
      ...options,
    });

    if (result.error) {
      const messages = this.getValidationErrorMessage(result.error.details);
      return {
        err: messages,
        result: null,
      };
    }

    return {
      err: null,
      result: result.value,
    };
  }
}
