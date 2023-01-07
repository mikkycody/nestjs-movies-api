import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { User } from '../interfaces/index';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
  ) {}

  async register(): Promise<User> {
    // return this.userModel.create();
  }
}
