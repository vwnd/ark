import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { RequestUser } from './dto/user.type';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller('auth')
export class AuthController {
  private readonly successRedirectURL: string;
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {
    this.successRedirectURL = this.configService.getOrThrow<string>(
      'OAUTH_SUCCESS_REDIRECT_URL',
    );
  }

  @Get('signin/google')
  @UseGuards(GoogleAuthGuard)
  signinGoogle() {}

  @Get('callback/google')
  @UseGuards(GoogleAuthGuard)
  async callbackGoogle(
    @CurrentUser() user: RequestUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.authenticate(user, response);
    return response.redirect(this.successRedirectURL);
  }

  @Get('signin/github')
  @UseGuards(GithubAuthGuard)
  signinGitHub() {}

  @Get('callback/github')
  @UseGuards(GithubAuthGuard)
  async callbackGitHub(
    @CurrentUser() user: RequestUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.authenticate(user, response);
    return response.redirect(this.successRedirectURL);
  }
}
