import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto';

@Controller('movies')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async create(@Body() dto: RegisterUserDto) {
    return this.authService.register(dto);
  }

}
