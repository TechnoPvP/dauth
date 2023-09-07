import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GithubApi } from '../../common/auth/github/github.api';
import { AuthService } from './auth.service';
import { GithubCallbackDto } from './dto/github-callback.dto';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly github: GithubApi) {}

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

  @Post('github/callback')
  async githubCallback(@Body() githubCallbackDto: GithubCallbackDto) {
    return this.authService.githubCallback(githubCallbackDto)
  }

  @UseGuards(AuthenticatedGuard)
  @Get('me')
  async me(@Request() req: any) {
    return req.user;
  }
}
