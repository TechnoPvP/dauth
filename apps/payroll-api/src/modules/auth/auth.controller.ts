import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GithubApi } from '../../common/auth/github/github.api';
import { AuthService } from './auth.service';
import { GithubCallbackDto } from './dto/github-callback.dto';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  Response as ExpressResponse,
  Request as ExpressRequest,
} from 'express';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { GoogleStrategy } from './strategies/google.strategy';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly github: GithubApi
  ) {}

  private readonly DEFAULT_REDIRECT_URL = 'https://localhost:4200';

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    return req.user;
  }

  @UseGuards(GithubAuthGuard)
  @Get('login/github')
  async loginGithub(@Request() req: ExpressRequest) {
    req.session.redirectUrl = 'https://payroll.airhublabs.dev';

    return req.user;
  }

  @UseGuards(GithubAuthGuard)
  @Get('github/callback')
  async githubCallback(
    @Request() req: ExpressRequest,
    @Response() res: ExpressResponse,
    @Query() githubCallbackDto: any
  ) {
    const redirectUrl = req.session?.redirectUrl || 'http://localhost:4200';

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
    // const redirectUrl = req.session?.redirectUrl || 'http://localhost:4200';

    return res.redirect("http://localhost:4200");
  }

  @UseGuards(AuthenticatedGuard)
  @Get('me')
  async me(@Request() req: any) {
    return req.user;
  }
}
