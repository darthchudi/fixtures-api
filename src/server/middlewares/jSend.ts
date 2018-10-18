import { Request, Response, NextFunction } from 'express';

class JSendMiddleware {
  res: Response;

  constructor(res: Response) {
    this.res = res;
  }

  success(data: any) {
    const payload = {
      status: 'success',
      data,
    };
    this.res.json(payload);
  }

  fail(data: any, message: string) {
    const payload = {
      status: 'fail',
      data,
      message,
    };
    this.res.json(payload);
  }

  error(message: string, code?: string, data?: any) {
    const payload = {
      status: 'error',
      message,
      code,
      data,
    };
    this.res.json(payload);
  }
}

//Export the middleware function which instantiates the Jsend middleware class and passes the response to the consturctor
export default (req: Request, res: Response, next: NextFunction) => {
  const jsend = new JSendMiddleware(res);
  res.jSend = jsend;
  next();
};
