import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { Model, Types } from 'mongoose';
import { Movie } from '../../src/interfaces';
import { GenderEnum } from '../../src/enums';

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
  let movieId = new Types.ObjectId();
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
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(MovieService);
    model = module.get<Model<Movie>>('MOVIE_MODEL');
  });

  it('should be defined', () => {
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

  it('should update a movie', async () => {
    jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce({
        userId: 1,
        title: 'Updated Movie Title',
        description: 'Movie description',
        releaseDate: '2023-01-07',
        rating: 4,
        gender: 'Male',
        actors: ['Jackie chan', 'George Bush'],
        imageUrl: ' https://imdb.net/lmnopq',
      }),
    } as any);
    const movie = await service.update(movieId, {
      title: 'Updated Movie Title',
    });
    expect(movie).toEqual({
      userId: 1,
      title: 'Updated Movie Title',
      description: 'Movie description',
      releaseDate: '2023-01-07',
      rating: 4,
      gender: 'Male',
      actors: ['Jackie chan', 'George Bush'],
      imageUrl: ' https://imdb.net/lmnopq',
    });
  });

  it('should delete a movie', async () => {
    jest.spyOn(model, 'findByIdAndDelete').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce({
        userId: 1,
        title: 'Movie Title',
        description: 'Movie description',
        releaseDate: '2023-01-07',
        rating: 4,
        gender: 'Male',
        actors: ['Jackie chan', 'George Bush'],
        imageUrl: ' https://imdb.net/lmnopq',
      }),
    } as any);
    const movie = await service.destroy(movieId);
    expect(movie).toEqual({
      userId: 1,
      title: 'Movie Title',
      description: 'Movie description',
      releaseDate: '2023-01-07',
      rating: 4,
      gender: 'Male',
      actors: ['Jackie chan', 'George Bush'],
      imageUrl: ' https://imdb.net/lmnopq',
    });
  });
});
