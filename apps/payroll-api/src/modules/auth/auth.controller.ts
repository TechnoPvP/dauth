import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    return req.user;
  }

  @UseGuards(AuthGuard('github'))
  @Get('login/github')
  async loginGithub(@Request() req: any) {
    return req.user;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('me')
  async me(@Request() req: any) {
    return req.user
  }
}
