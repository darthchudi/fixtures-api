import { injectable } from 'inversify';
import { Response, Request } from 'express';
import HTTPStatus from '../../common/constants/http-status';
import RepositoryErrors from '../../data/errors/repository';

@injectable()
export default class BaseController {
  private parseError(error: any) {
    let message, httpCode, errorCode;

    if (error instanceof RepositoryErrors.ModelNotFoundError) {
      message = error.message || 'Model not found';
      httpCode = HTTPStatus.NOT_FOUND;
      errorCode = error.code;
    } else if (error instanceof RepositoryErrors.DuplicateModelError) {
      message = error.message || 'Model already exists';
      httpCode = HTTPStatus.BAD_REQUEST;
      errorCode = error.code;
    } else {
      message = error.message || 'An error occured we are handling it';
      httpCode = HTTPStatus.INTERNAL_SERVER_ERROR;
      errorCode = 'ServerError';
    }
    return {
      message,
      httpCode,
      errorCode,
    };
  }

  handleValidationError(error: any, req: Request, res: Response) {
    res.status(HTTPStatus.VALIDATION_ERROR);
    res.jSend.fail(error, 'One or more validation errors occured');
  }

  handleError(error: any, req: Request, res: Response) {
    const { message, httpCode, errorCode } = this.parseError(error);
    res.status(httpCode);
    res.jSend.error(message, errorCode);
  }

  handleSuccess(data: any, req: Request, res: Response, message?: string) {
    res.jSend.success(data);
  }
}
