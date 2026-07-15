
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { EmailAlreadyInUseException } from '../../domain/exception/email-already-in-use.exception';
import { InvalidEmailException } from '../../domain/exception/invalid-email.exception';

@Catch(EmailAlreadyInUseException, InvalidEmailException)
export class UserExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<Response>();

    const status =
      exception instanceof EmailAlreadyInUseException
        ? HttpStatus.CONFLICT      // 409
        : HttpStatus.BAD_REQUEST;  // 400

    res.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}