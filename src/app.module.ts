import { Module } from '@nestjs/common';
import { MoviesModule } from './movie/movie.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    MoviesModule,
  ],
})
export class AppModule {}
