import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponseDto } from 'src/generic/dto/ErrorResponseDto';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    this.logger.error(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const message = exception.message;
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      status = exception.getStatus() || status;
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.warn(exception.stack);
    }

    const errorResponse = new ErrorResponseDto(
      false,
      status,
      message,
      request.url,
    );

    response.status(status).json(errorResponse);
  }
}
