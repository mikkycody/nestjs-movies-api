import { Connection } from 'mongoose';
import { MovieSchema } from '../../database/schemas/Movie/movie.schema';

export const moviesProviders = [
  {
    provide: 'MOVIE_MODEL',
    useFactory: (connection: Connection) => connection.model('Movie', MovieSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];