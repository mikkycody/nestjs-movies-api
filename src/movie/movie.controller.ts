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
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @UseGuards(JwtGuard)
  @Post()
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

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id') movieId: string,
    @GetUser('id') userId: Types.ObjectId,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.movieService.update(movieId, userId, updateMovieDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async destroy(
    @Param('id') movieId: string,
    @GetUser('id') userId: Types.ObjectId,
  ) {
    return this.movieService.destroy(movieId, userId);
  }
}
