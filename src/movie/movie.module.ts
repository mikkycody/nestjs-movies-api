import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { moviesProviders } from './movies.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MovieController],
  providers: [MovieService, ...moviesProviders],
})
export class MoviesModule {}