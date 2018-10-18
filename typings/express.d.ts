interface jSend {
  success(data: any);
  fail(data: any, message: string);
  error(message: string, code?: string, data?: any);
}

declare namespace Express {
  export interface Response {
    jSend: jSend;
  }
}
