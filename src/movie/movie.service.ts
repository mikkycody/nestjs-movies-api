import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Movie } from '../interfaces/index';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MovieService {
  constructor(
    @Inject('MOVIE_MODEL')
    private movieModel: Model<Movie>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const createdMovie = new this.movieModel(createMovieDto);
    return createdMovie.save();
  }

  async findAll(): Promise<Movie[]> {
    return this.movieModel.find();
  }
}