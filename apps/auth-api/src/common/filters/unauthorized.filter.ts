import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';

@Catch()
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  constructor(private host: HttpAdapterHost) {}

  private readonly logger = new Logger(UnauthorizedExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const message = exception.message;
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const responseBody = {
      statusCode: status,
      path: request.url,
      timestamp: new Date().toISOString(),
      message,
    };

    Object.assign(responseBody, exceptionResponse);

    this.logger.error(exceptionResponse);

    return response.status(status).json(responseBody);
  }
}
