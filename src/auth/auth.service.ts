import { Model } from 'mongoose';
import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { User } from '../interfaces/index';
import { LoginUserDto, RegisterUserDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
  ) {}

  protected async hashPassword(password): Promise<string> {
    const hash = await argon.hash(password);
    return hash;
  }

  async register(dto: RegisterUserDto): Promise<User> {
    dto.password = await this.hashPassword(dto.password);
    return this.userModel.create(dto);
  }

  async login(dto: LoginUserDto): Promise<User> {
    const user = await this.userModel
      .findOne({
        email: dto.email,
      })
      .exec();

    if (!user) {
      throw new ForbiddenException('Credentials do not match');
    }

    const verify = await argon.verify(user.password as string, dto.password);

    if (!verify) {
      throw new ForbiddenException('Credentials do not match');
    }
    return user;
  }
}
