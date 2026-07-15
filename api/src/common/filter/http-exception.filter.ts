// common/filter/http-exception.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const payload = exception.getResponse();

    const message =
      typeof payload === 'string'
        ? payload
        : (payload as { message?: string | string[] }).message;

    res.status(status).json({
      statusCode: status,
      error: exception.name,
      message,
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
}