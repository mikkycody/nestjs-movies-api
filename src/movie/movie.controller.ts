import { Body, Controller, Get, Post } from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto';

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
}
