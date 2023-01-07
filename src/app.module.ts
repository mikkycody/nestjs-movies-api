import { Module } from '@nestjs/common';
import { MoviesModule } from './movie/movie.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MoviesModule,
  ],
})
export class AppModule {}
