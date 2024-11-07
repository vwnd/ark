import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IVerifyOptions, Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(
    email: string,
    password: string,
    done: (
      error: any,
      user?: Express.User | false,
      options?: IVerifyOptions,
    ) => void,
  ) {
    try {
      const user = await this.authService.verifyAndGetUser(email, password);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
