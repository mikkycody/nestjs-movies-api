import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { Model, Types } from 'mongoose';
import { Movie } from '../interfaces';
import { GenderEnum } from '../tmp/enums';
import { ForbiddenException } from '@nestjs/common';
import { MOVIE_MODEL } from '../config/constants';

describe('MovieService', () => {
  let service: MovieService;
  let model: Model<Movie>;
  let movieId = new Types.ObjectId();
  let userId = new Types.ObjectId();
  const mockMovie = {
    userId,
    title: 'Movie Title',
    description: 'Movie description',
    releaseDate: '2023-01-07',
    rating: 4,
    gender: 'Male',
    actors: ['Jackie chan', 'George Bush'],
    imageUrl: 'https://imdb.net/lmnopq',
  };

  const mockMovieCollection = [
    {
      userId,
      title: 'Movie Title',
      description: 'Movie description',
      releaseDate: '2023-01-07',
      rating: 4,
      gender: 'Male',
      actors: ['Jackie chan', 'George Bush'],
      imageUrl: 'https://imdb.net/lmnopq',
    },
    {
      userId,
      title: 'Movie Title 2',
      description: 'Movie description 2',
      releaseDate: '2023-01-07',
      rating: 5,
      gender: 'Female',
      actors: ['Jackie chan', 'George Bush'],
      imageUrl: 'https://imdb.net/lmnopq',
    },
  ];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: MOVIE_MODEL,
          useValue: {
            new: jest.fn().mockResolvedValue(mockMovie),
            constructor: jest.fn().mockResolvedValue(mockMovie),
            find: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(MovieService);
    model = module.get<Model<Movie>>(MOVIE_MODEL);
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
    jest
      .spyOn(model, 'create')
      .mockImplementationOnce(() => Promise.resolve(mockMovie));
    const movie = await service.create(userId, {
      title: mockMovie.title,
      description: mockMovie.description,
      releaseDate: mockMovie.releaseDate,
      rating: mockMovie.rating,
      gender: mockMovie.gender as GenderEnum,
      actors: mockMovie.actors,
      imageUrl: mockMovie.imageUrl,
    });
    expect(movie).toEqual(mockMovie);
  });

  it('should update a movie', async () => {
    jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(mockMovie),
    } as any);

    jest.spyOn(model, 'findById').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce({
        userId,
      }),
    } as any);
    const movie = await service.update(movieId.toString(), userId, {
      title: 'Updated Movie Title',
    });
    expect(movie).toEqual(mockMovie);
  });

  it('should not update a movie that does not exist', async () => {
    jest.spyOn(model, 'findById').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(null),
    } as any);
    await expect(
      service.update(movieId.toString(), userId, {
        title: 'Updated Movie Title',
      }),
    ).rejects.toThrowError(ForbiddenException);
  });

  it('should not update a movie that does not belong to user', async () => {
    jest.spyOn(model, 'findById').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce({ userId: 'incorrect' }),
    } as any);
    await expect(
      service.update(movieId.toString(), userId, {
        title: 'Updated Movie Title',
      }),
    ).rejects.toThrowError(ForbiddenException);
  });

  it('should delete a movie', async () => {
    jest.spyOn(model, 'findByIdAndDelete').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(mockMovie),
    } as any);
    jest.spyOn(model, 'findById').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce({
        userId,
      }),
    } as any);
    const movie = await service.destroy(movieId.toString(), userId);
    expect(movie).toEqual(mockMovie);
  });

  it('should not delete a movie that does not exist', async () => {
    jest.spyOn(model, 'findById').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(null),
    } as any);
    await expect(
      service.destroy(movieId.toString(), userId),
    ).rejects.toThrowError(ForbiddenException);
  });

  it('should not delete a movie that does not belong to user', async () => {
    jest.spyOn(model, 'findById').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce({ userId: 'incorrect' }),
    } as any);
    await expect(
      service.destroy(movieId.toString(), userId),
    ).rejects.toThrowError(ForbiddenException);
  });
});
