import { Connection } from 'mongoose';
import { MovieSchema } from '../../database/schemas/Movie/movie.schema';
import { MOVIE_MODEL, DATABASE_CONNECTION } from '../../config/constants';

export const moviesProviders = [
  {
    provide: MOVIE_MODEL,
    useFactory: (connection: Connection) => connection.model('Movie', MovieSchema),
    inject: [DATABASE_CONNECTION],
  },
];