import { UsersService } from '@/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { Response } from 'express';
import { LoginInput } from './dto/login.input';
import { LoginOutput } from './dto/login.output';
import { TokenPayload } from './dto/token-payload.interface';
import { RequestUser } from './dto/user.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(input: LoginInput, response: Response): Promise<LoginOutput> {
    const { email, password } = input;

    const user = await this.verifyAndGetUser(email, password);

    const { accessToken } = await this.authenticate(user, response);

    return {
      token: accessToken,
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  async authenticate(
    user: RequestUser,
    response: Response,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const expiresAccessToken = new Date();
    expiresAccessToken.setMilliseconds(
      expiresAccessToken.getTime() +
        parseInt(
          this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION_MS'),
        ),
    );

    const tokenPayload: TokenPayload = {
      sub: user.id,
    };

    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow(
        'JWT_ACCESS_TOKEN_EXPIRATION_MS',
      )}ms`,
    });

    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: expiresAccessToken,
    });

    return {
      accessToken,
      refreshToken: '', // TODO: implement refresh token
    };
  }

  async verifyAndGetUser(
    email: string,
    password: string,
  ): Promise<RequestUser> {
    try {
      const user = await this.usersService.getUserByEmail(email);

      const authenticated = await compare(password, user.password);

      if (!authenticated) {
        throw new UnauthorizedException();
      }

      const userDto: RequestUser = {
        ...user,
      };

      return userDto;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials.');
    }
  }
}
