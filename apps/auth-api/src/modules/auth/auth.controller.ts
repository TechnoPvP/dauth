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
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly DEFAULT_REDIRECT_URL = 'http://localhost:4200';
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

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
    const redirectUrl =
      req.session?.redirectUrl ||
      req.user.redirectUrl ||
      this.DEFAULT_REDIRECT_URL;
    delete req.session.redirectUrl;

    console.log(redirectUrl);

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
    console.log(req.user, req.session);
    return req.user;
  }

  @Post('logout')
  async logout(
    @Request() req: ExpressRequest,
    @Response() res: ExpressResponse
  ) {
    if (!req.session || !req.user) {
      res
        .status(401)
        .json({ message: 'You must be logged in to preform this action' });
      return;
    }
    try {
      await this.authService.destroySession(req);

      res
        .status(200)
        .clearCookie('connect.sid')
        .json({ message: 'Logged out successfully' });
    } catch (error) {
      this.logger.error('Failed to logout user', error);

      if (req.session) {
        try {
          await this.authService.logout(req);
          this.logger.error(
            'Forcefully destroyed session after failed logout attempt',
            error
          );
        } catch (error) {
          this.logger.error('Failed to forcefully destroy session', error);
        } finally {
          res
            .status(501)
            .clearCookie('connect.sid')
            .json({ message: 'Graceful logout failed, destroying session' });
        }
      }
    }
  }
}
