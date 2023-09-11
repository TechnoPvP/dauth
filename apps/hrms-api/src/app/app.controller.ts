import { Controller, Get, Req, Request, UseGuards } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AppService } from './app.service';
import { AuthenticatedGuard } from '@dauth/auth';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @UseGuards(AuthenticatedGuard)
  @Get('employee')
  listEmployee(@Request() request: ExpressRequest) {
    return {
      session: request.session,
      user: request.user || null,
      status: 'unknown',
    };
  }
}
