import { Model, Types } from 'mongoose';
import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { Movie } from '../interfaces/index';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MOVIE_MODEL } from '../config/constants';

@Injectable()
export class MovieService {
  constructor(
    @Inject(MOVIE_MODEL)
    private movieModel: Model<Movie>,
  ) {}

  async create(
    userId: Types.ObjectId,
    createMovieDto: CreateMovieDto,
  ): Promise<Movie> {
    return this.movieModel.create({ ...createMovieDto, userId });
  }

  async findAll(): Promise<Movie[]> {
    return this.movieModel.find().exec();
  }

  async update(
    movieId: string,
    userId: Types.ObjectId,
    dto: UpdateMovieDto,
  ): Promise<Movie> {
    await this.checkMovieOwner(userId, movieId);
    return this.movieModel
      .findByIdAndUpdate(movieId, { ...dto }, { new: true })
      .exec();
  }

  async destroy(movieId: string, userId: Types.ObjectId): Promise<Movie> {
    await this.checkMovieOwner(userId, movieId);
    return this.movieModel.findByIdAndDelete(movieId).exec();
  }

  async checkMovieOwner(userId, movieId) {
    const movie = await this.movieModel.findById(movieId).exec();
    if (!movie || movie.userId.toString() !== userId.toString()) {
      throw new ForbiddenException(
        'You are unauthorized to access this resource.',
      );
    }
    return true;
  }
}
