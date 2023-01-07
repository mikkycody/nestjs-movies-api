import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Types } from 'mongoose';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  async create(@Body() createMovieDto: CreateMovieDto) {
    return this.movieService.create(createMovieDto);
  }

  @Get()
  async findAll() {
    return this.movieService.findAll();
  }

  @Patch(':id')
  async update(@Param('id') movieId: Types.ObjectId, @Body() dto: UpdateMovieDto) {
    return this.movieService.update(movieId, dto);
  }

  @Delete(':id')
  async destroy(@Param('id') movieId: Types.ObjectId) {
    return this.movieService.destroy(movieId);
  }
}
