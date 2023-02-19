import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const resp_ = exception.getResponse();
    const resp: any = typeof resp_ === 'string' ? { message: resp_ } : resp_;
    response.status(status).json({
      status: status,
      error: {
        type: exception.name,
        code: resp.code || resp.error,
        message: resp.message || 'Something went wrong',
      },
    });
  }
}
