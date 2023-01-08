import { Model, Types } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Movie } from '../interfaces/index';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MovieService {
  constructor(
    @Inject('MOVIE_MODEL')
    private movieModel: Model<Movie>,
  ) {}

  async create(userId: Types.ObjectId, createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.movieModel.create({...createMovieDto, userId});
  }

  async findAll(): Promise<Movie[]> {
    return this.movieModel.find().exec();
  }

  async update(movieId: Types.ObjectId, dto: UpdateMovieDto): Promise<Movie> {
    return this.movieModel.findByIdAndUpdate(
      movieId,
      { ...dto },
      { new: true },
    ).exec();
  }

  async destroy(movieId: Types.ObjectId): Promise<Movie> {
    return this.movieModel.findByIdAndDelete(movieId).exec();
  }
}
