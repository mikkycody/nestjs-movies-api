import { Model, Types } from 'mongoose';
import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { User } from '../interfaces/index';
import { LoginUserDto, RegisterUserDto } from './dto';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserResourceType } from '../types';
import { USER_MODEL } from '../config/constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_MODEL)
    private userModel: Model<User>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async hashPassword(password): Promise<string> {
    const hash = await argon.hash(password);
    return hash;
  }

  async verifyPassword(hash: string, plainPassword: string): Promise<boolean> {
    return argon.verify(hash, plainPassword);
  }

  async register(dto: RegisterUserDto): Promise<UserResourceType> {
    dto.password = await this.hashPassword(dto.password);
    const user = await this.userModel.create(dto);
    const token = await this.generateToken(user._id, user.email as string);
    return {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      token,
    };
  }

  async login(dto: LoginUserDto): Promise<UserResourceType> {
    const user = await this.userModel
      .findOne({
        email: dto.email,
      })
      .exec();
    if (!user) {
      throw new ForbiddenException('Credentials do not match');
    }

    const verify = await this.verifyPassword(
      user.password as string,
      dto.password,
    );

    if (!verify) {
      throw new ForbiddenException('Credentials do not match');
    }
    const token = await this.generateToken(user._id, user.email as string);
    return {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      token,
    };
  }

  generateToken(userId: Types.ObjectId, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };

    return this.jwt.signAsync(payload, {
      expiresIn: '60m',
      secret: this.config.get('JWT_SECRET'),
    });
  }
}
