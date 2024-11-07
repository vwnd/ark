import { UsersService } from '@/users/users.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import * as crypto from 'crypto';
import { Strategy } from 'passport-google-oauth20';
import { RequestUser } from '../dto/user.type';
import { GoogleProfile } from '../interfaces/google-profile.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: configService.getOrThrow('GOOGLE_OAUTH_CLIENT_ID'),
      clientSecret: configService.getOrThrow('GOOGLE_OAUTH_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow('GOOGLE_OAUTH_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
  ): Promise<RequestUser> {
    try {
      const email = profile.emails[0].value;
      // get user by email
      const user = await this.usersService.getUserByEmail(email);
      // if user exists, return user
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        // if user does not exist, create user
        const randomPassword = crypto.randomBytes(16).toString('hex');
        const newUser = await this.usersService.create({
          email: profile.emails[0].value,
          name: profile.displayName,
          password: randomPassword,
        });

        const user = await this.usersService.getUserById(newUser.id);

        return {
          ...user,
        };
      }

      throw error;
    }
  }
}
