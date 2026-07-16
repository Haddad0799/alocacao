import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ProfileAlreadyExistsException } from '../../domain/exception/profile-already-exists.exception';

@Catch(ProfileAlreadyExistsException)
export class DeveloperExceptionFilter implements ExceptionFilter {
  catch(exception: ProfileAlreadyExistsException, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<Response>();
    res.status(HttpStatus.CONFLICT).json({
      statusCode: HttpStatus.CONFLICT,
      message: exception.message,
    });
  }
}