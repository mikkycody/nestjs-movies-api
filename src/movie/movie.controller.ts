import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Types } from 'mongoose';
import { JwtGuard } from '../../src/auth/guard';
import { GetUser } from 'src/auth/decorator';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  @UseGuards(JwtGuard)
  async create(
    @GetUser('id') userId: Types.ObjectId,
    @Body() createMovieDto: CreateMovieDto,
  ) {
    return this.movieService.create(userId, createMovieDto);
  }

  @Get()
  async findAll() {
    return this.movieService.findAll();
  }

  @Patch(':id')
  async update(
    @Param('id') movieId: Types.ObjectId,
    @Body() dto: UpdateMovieDto,
  ) {
    return this.movieService.update(movieId, dto);
  }

  @Delete(':id')
  async destroy(@Param('id') movieId: Types.ObjectId) {
    return this.movieService.destroy(movieId);
  }
}
