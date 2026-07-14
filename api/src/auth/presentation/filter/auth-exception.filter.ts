// auth/presentation/filter/auth-exception.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { InvalidCredentialsException } from '../../domain/exception/invalid-credentials.exception';

@Catch(InvalidCredentialsException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(_: InvalidCredentialsException, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<Response>();
    res.status(HttpStatus.UNAUTHORIZED).json({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Invalid credentials',
    });
  }
}