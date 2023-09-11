import {
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { AzureAdAuthGuard } from './guards/azure-ad-auth.guard';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  private readonly DEFAULT_REDIRECT_URL = 'http://localhost:4200';
  private readonly logger = new Logger(AuthController.name);

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    return req.user;
  }

  @UseGuards(GithubAuthGuard)
  @Get('login/github')
  async loginGithub(@Request() req: ExpressRequest) {
    return req.user;
  }

  @UseGuards(GithubAuthGuard)
  @Get('github/callback')
  async githubCallback(
    @Request() req: ExpressRequest,
    @Response() res: ExpressResponse,
    @Query() githubCallbackDto: any
  ) {
    const redirectUrl = req.session?.redirectUrl || this.DEFAULT_REDIRECT_URL;
    delete req.session.redirectUrl;

    return res.redirect(redirectUrl);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('login/google')
  async loginGoogle(@Request() req: ExpressRequest) {
    return req?.user;
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(
    @Request() req: ExpressRequest,
    @Response() res: ExpressResponse
  ) {
    const redirectUrl = req.session?.redirectUrl || this.DEFAULT_REDIRECT_URL;
    delete req.session.redirectUrl;

    return res.redirect(redirectUrl);
  }

  @UseGuards(AzureAdAuthGuard)
  @Get('login/azure')
  async loginAzure(@Request() req: ExpressRequest) {
    return req?.user;
  }

  @UseGuards(AzureAdAuthGuard)
  @Post('azure/callback')
  async azureCallback(
    @Request() req: ExpressRequest,
    @Response() res: ExpressResponse
  ) {
    const redirectUrl = req.session?.redirectUrl || this.DEFAULT_REDIRECT_URL;

    return res.redirect(redirectUrl);
  }

  @Get('me')
  async me(@Request() req: ExpressRequest) {
    return req.user;
  }

}
