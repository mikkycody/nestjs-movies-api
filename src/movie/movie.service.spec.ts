import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { Model } from 'mongoose';
import { Movie } from 'src/interfaces';
import { async } from 'rxjs';
import { GenderEnum } from 'src/enums';

const mockMovie = {
  userId: 1,
  title: 'Movie Title',
  description: 'Movie description',
  releaseDate: '2023-01-07',
  rating: 4,
  gender: 'Male',
  actors: ['Jackie chan', 'George Bush'],
  imageUrl: ' https://imdb.net/lmnopq',
};

const mockMovieCollection = [
  {
    userId: 1,
    title: 'Movie Title',
    description: 'Movie description',
    releaseDate: '2023-01-07',
    rating: 4,
    gender: 'Male',
    actors: ['Jackie chan', 'George Bush'],
    imageUrl: ' https://imdb.net/lmnopq',
  },
  {
    userId: 1,
    title: 'Movie Title 2',
    description: 'Movie description 2',
    releaseDate: '2023-01-07',
    rating: 5,
    gender: 'Female',
    actors: ['Jackie chan', 'George Bush'],
    imageUrl: ' https://imdb.net/lmnopq',
  },
];

describe('MovieService', () => {
  let service: MovieService;
  let model: Model<Movie>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: 'MOVIE_MODEL',
          useValue: {
            new: jest.fn().mockResolvedValue(mockMovie),
            constructor: jest.fn().mockResolvedValue(mockMovie),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(MovieService);
    model = module.get<Model<Movie>>('MOVIE_MODEL');
  });

  it('should be set', () => {
    expect(service).toBeDefined();
  });

  it('should return all movies', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockMovieCollection),
    } as any);
    const movies = await service.findAll();
    expect(movies).toEqual(mockMovieCollection);
  });

  it('should create a movie', async () => {
    jest.spyOn(model, 'create').mockImplementationOnce(() =>
      Promise.resolve({
        userId: 1,
        title: 'Movie Title',
        description: 'Movie description',
        releaseDate: '2023-01-07',
        rating: 4,
        gender: 'Male',
        actors: ['Jackie chan', 'George Bush'],
        imageUrl: ' https://imdb.net/lmnopq',
      }),
    );
    const movie = await service.create({
      userId: 1,
      title: 'Movie Title',
      description: 'Movie description',
      releaseDate: '2023-01-07',
      rating: 4,
      gender: 'Male' as GenderEnum,
      actors: ['Jackie chan', 'George Bush'],
      imageUrl: ' https://imdb.net/lmnopq',
    });
    expect(movie).toEqual(mockMovie);
  });
});
