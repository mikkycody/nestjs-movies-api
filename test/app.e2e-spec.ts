import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import * as mongoose from 'mongoose';
import { RegisterUserDto } from 'src/auth/dto';
import * as pactum from 'pactum';
import { MongoExceptionFilter } from '../src/exceptions';

async function refreshDB() {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
}

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalFilters(new MongoExceptionFilter());
    await app.init();
    await app.listen(3333);
    refreshDB();
    pactum.request.setBaseUrl('http://localhost:3333/');
  });

  afterAll(() => {
    app.close();
  });
  const loginRoute = 'auth/login';
  const registerRoute = 'auth/register';

  describe('Authentication', () => {
    const mockUserDto: RegisterUserDto = {
      email: 'test@gmail.com',
      password: '$Password1#',
      firstName: 'John',
      lastName: 'Doe',
    };

    describe('sign up', () => {
      it('should not sign up if body is empty', () => {
        return pactum
          .spec()
          .post(registerRoute)
          .expectStatus(HttpStatus.BAD_REQUEST)
          .expectJsonLike({
            message: [
              'email must be an email',
              'email should not be empty',
              'password should not be empty',
              'password must be a string',
              'password must be 8 characters or more, must contain mixed case, number and symbol',
              'password must be shorter than or equal to 20 characters',
              'password must be longer than or equal to 8 characters',
              'firstName should not be empty',
              'firstName must be a string',
              'lastName should not be empty',
              'lastName must be a string',
            ],
          });
      });

      it('should not sign up if email is empty', () => {
        return pactum
          .spec()
          .post(registerRoute)
          .withBody({
            password: mockUserDto.password,
            firstName: mockUserDto.firstName,
            lastName: mockUserDto.lastName,
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
          .expectJsonLike({
            message: ['email must be an email', 'email should not be empty'],
          });
      });

      it('should not sign up if email is not a valid email', () => {
        return pactum
          .spec()
          .post(registerRoute)
          .withBody({
            email: 'invalid',
            password: mockUserDto.password,
            firstName: mockUserDto.firstName,
            lastName: mockUserDto.lastName,
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
          .expectJsonLike({
            message: ['email must be an email'],
          });
      });

      it('should not sign up if password is empty', () => {
        return pactum
          .spec()
          .post(registerRoute)
          .withBody({
            email: mockUserDto.email,
            firstName: mockUserDto.firstName,
            lastName: mockUserDto.lastName,
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
          .expectJsonLike({
            message: ['password should not be empty'],
          });
      });

      it('should not sign up if password is not strong enough', () => {
        return pactum
          .spec()
          .post(registerRoute)
          .withBody({
            email: mockUserDto.email,
            password: 'weak',
            firstName: mockUserDto.firstName,
            lastName: mockUserDto.lastName,
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
          .expectJsonLike({
            message: [
              'password must be 8 characters or more, must contain mixed case, number and symbol',
              'password must be longer than or equal to 8 characters',
            ],
          });
      });

      it('should not sign up if first name is empty', () => {
        return pactum
          .spec()
          .post(registerRoute)
          .withBody({
            email: mockUserDto.email,
            password: mockUserDto.password,
            lastName: mockUserDto.lastName,
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
          .expectJsonLike({
            message: [
              'firstName should not be empty',
              'firstName must be a string',
            ],
          });
      });

      it('should not sign up if last name is empty', () => {
        return pactum
          .spec()
          .post(registerRoute)
          .withBody({
            email: mockUserDto.email,
            password: mockUserDto.password,
            firstName: mockUserDto.firstName,
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
          .expectJsonLike({
            message: [
              'lastName should not be empty',
              'lastName must be a string',
            ],
          });
      });

      it('should not sign up if last name is empty', () => {
        return pactum
          .spec()
          .post(registerRoute)
          .withBody({
            email: mockUserDto.email,
            password: mockUserDto.password,
            firstName: mockUserDto.firstName,
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
          .expectJsonLike({
            message: [
              'lastName should not be empty',
              'lastName must be a string',
            ],
          });
      });

      it('should sign up', () => {
        return pactum
          .spec()
          .post(registerRoute)
          .withBody(mockUserDto)
          .expectStatus(HttpStatus.CREATED)
          .expectJsonLike({
            email: mockUserDto.email,
            firstName: mockUserDto.firstName,
            lastName: mockUserDto.lastName,
          });
      });

      it('should not sign up if email is taken', () => {
        return pactum
          .spec()
          .post(registerRoute)
          .withBody(mockUserDto)
          .expectStatus(409)
          .expectJsonLike({
            message: 'email has been taken',
          });
      });
    });

    describe('sign in', () => {
      it('should not sign in if body is empty', () => {
        return pactum
          .spec()
          .post(loginRoute)
          .expectStatus(HttpStatus.BAD_REQUEST)
          .expectJsonLike({
            message: [
              'email must be an email',
              'email should not be empty',
              'password should not be empty',
              'password must be a string',
            ],
          });
      });

      it('should not sign in if email is empty', () => {
        return pactum
          .spec()
          .post(loginRoute)
          .withBody({
            password: mockUserDto.password,
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
          .expectJsonLike({
            message: ['email must be an email', 'email should not be empty'],
          });
      });

      it('should not sign in if email is not a valid email', () => {
        return pactum
          .spec()
          .post(loginRoute)
          .withBody({
            email: 'invalid',
            password: mockUserDto.password,
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
          .expectJsonLike({
            message: ['email must be an email'],
          });
      });

      it('should not sign in if password is empty', () => {
        return pactum
          .spec()
          .post(loginRoute)
          .withBody({
            email: mockUserDto.email,
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
          .expectJsonLike({
            message: ['password should not be empty'],
          });
      });

      it('should not sign in if email does not exist', () => {
        return pactum
          .spec()
          .post(loginRoute)
          .withBody({
            email: 'doesntexist@test.com',
            password: mockUserDto.password,
          })
          .expectStatus(403)
          .expectJsonLike({
            message: 'Credentials do not match',
          });
      });

      it('should not sign in with wrong user details', () => {
        return pactum
          .spec()
          .post(loginRoute)
          .withBody({
            email: mockUserDto.email,
            password: 'wrongpassword',
          })
          .expectStatus(403)
          .expectJsonLike({
            message: 'Credentials do not match',
          });
      });

      it('should sign in', () => {
        return pactum
          .spec()
          .post(loginRoute)
          .withBody({
            email: mockUserDto.email,
            password: mockUserDto.password,
          })
          .expectStatus(HttpStatus.OK)
          .expectJsonLike({
            email: mockUserDto.email,
            firstName: mockUserDto.firstName,
            lastName: mockUserDto.lastName,
          })
          .stores('bearer_token', 'token')
          .stores('userId', 'id');
      });
    });
  });

  describe('Movies', () => {
    const mockMovie = {
      title: 'Movie Title',
      description: 'Movie description',
      releaseDate: '2023-01-07',
      rating: 4,
      gender: 'Male',
      actors: ['Jackie chan', 'George Bush'],
      imageUrl: 'https://imdb.net/lmnopq',
    };

    const moviesRoute = 'movies';

    it('should get movies (empty)', () => {
      return pactum
        .spec()
        .get(moviesRoute)
        .expectStatus(HttpStatus.OK)
        .expectBody([]);
    });

    describe('Create Movie', () => {
      it('should not create a movie when not logged in', () => {
        return pactum
          .spec()
          .post(moviesRoute)
          .expectStatus(HttpStatus.UNAUTHORIZED)
          .expectJsonLike({
            message: 'Unauthorized',
          });
      });

      it('should not create a movie when body is empty', () => {
        return pactum
          .spec()
          .post(moviesRoute)
          .withHeaders({ Authorization: 'Bearer $S{bearer_token}' })
          .expectStatus(HttpStatus.BAD_REQUEST)
          .expectJsonLike({
            message: [
              'title must be shorter than or equal to 120 characters',
              'title should not be empty',
              'title must be a string',
              'description must be shorter than or equal to 500 characters',
              'description should not be empty',
              'description must be a string',
              'releaseDate should not be empty',
              'releaseDate must be a valid date and must be in the format YYYY-MM-DD',
              'rating should not be empty',
              'rating must be a number conforming to the specified constraints',
              'rating must not be greater than 5',
              'rating must not be less than 1',
              'gender must be one of the following values: Male, Female, Others',
              'gender should not be empty',
              'each value in actors must be a string',
              'actors should not be empty',
              'actors must be an array',
              'imageUrl should not be empty',
              'imageUrl must be a URL address',
            ],
          });
      });

      it('should not create a movie when title is empty', () => {
        return pactum
          .spec()
          .post(moviesRoute)
          .withHeaders({ Authorization: 'Bearer $S{bearer_token}' })
          .withBody({
            description: mockMovie.description,
            releaseDate: mockMovie.releaseDate,
            rating: mockMovie.rating,
            gender: mockMovie.gender,
            actors: mockMovie.actors,
            imageUrl: mockMovie.imageUrl,
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
          .expectJsonLike({
            message: ['title should not be empty', 'title must be a string'],
          });
      });

      it('should not create a movie when title is too long', () => {
        return pactum
          .spec()
          .post(moviesRoute)
          .withHeaders({ Authorization: 'Bearer $S{bearer_token}' })
          .withBody({
            title: 'x'.repeat(121),
            description: mockMovie.description,
            releaseDate: mockMovie.releaseDate,
            rating: mockMovie.rating,
            gender: mockMovie.gender,
            actors: mockMovie.actors,
            imageUrl: mockMovie.imageUrl,
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
          .expectJsonLike({
            message: ['title must be shorter than or equal to 120 characters'],
          });
      });

      it('should not create a movie when description is empty', () => {
        return pactum
          .spec()
          .post(moviesRoute)
          .withHeaders({ Authorization: 'Bearer $S{bearer_token}' })
          .withBody({
            title: mockMovie.title,
            releaseDate: mockMovie.releaseDate,
            rating: mockMovie.rating,
            gender: mockMovie.gender,
            actors: mockMovie.actors,
            imageUrl: mockMovie.imageUrl,
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
          .expectJsonLike({
            message: [
              'description should not be empty',
              'description must be a string',
            ],
          });
      });

      it('should not create a movie when description is too long', () => {
        return pactum
          .spec()
          .post(moviesRoute)
          .withHeaders({ Authorization: 'Bearer $S{bearer_token}' })
          .withBody({
            title: mockMovie.title,
            description: 'x'.repeat(501),
            releaseDate: mockMovie.releaseDate,
            rating: mockMovie.rating,
            gender: mockMovie.gender,
            actors: mockMovie.actors,
            imageUrl: mockMovie.imageUrl,
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
          .expectJsonLike({
            message: [
              'description must be shorter than or equal to 500 characters',
            ],
          });
      });

      it('should not create a movie when releaseDate is empty', () => {
        return pactum
          .spec()
          .post(moviesRoute)
          .withHeaders({ Authorization: 'Bearer $S{bearer_token}' })
          .withBody({
            title: mockMovie.title,
            description: mockMovie.description,
            rating: mockMovie.rating,
            gender: mockMovie.gender,
            actors: mockMovie.actors,
            imageUrl: mockMovie.imageUrl,
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
          .expectJsonLike({
            message: ['releaseDate should not be empty'],
          });
      });

      it('should not create a movie when releaseDate is not a valid date', () => {
        return pactum
          .spec()
          .post(moviesRoute)
          .withHeaders({ Authorization: 'Bearer $S{bearer_token}' })
          .withBody({
            title: mockMovie.title,
            description: mockMovie.description,
            releaseDate: 'invalidedate',
            rating: mockMovie.rating,
            gender: mockMovie.gender,
            actors: mockMovie.actors,
            imageUrl: mockMovie.imageUrl,
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
          .expectJsonLike({
            message: [
              'releaseDate must be a valid date and must be in the format YYYY-MM-DD',
            ],
          });
      });

      it('should not create a movie when rating is empty', () => {
        return pactum
          .spec()
          .post(moviesRoute)
          .withHeaders({ Authorization: 'Bearer $S{bearer_token}' })
          .withBody({
            title: mockMovie.title,
            description: mockMovie.description,
            releaseDate: mockMovie.releaseDate,
            gender: mockMovie.gender,
            actors: mockMovie.actors,
            imageUrl: mockMovie.imageUrl,
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
          .expectJsonLike({
            message: [
              'rating should not be empty',
              'rating must be a number conforming to the specified constraints',
            ],
          });
      });

      it('should not create a movie when rating is less than 1', () => {
        return pactum
          .spec()
          .post(moviesRoute)
          .withHeaders({ Authorization: 'Bearer $S{bearer_token}' })
          .withBody({
            title: mockMovie.title,
            description: mockMovie.description,
            releaseDate: mockMovie.releaseDate,
            rating: 0,
            gender: mockMovie.gender,
            actors: mockMovie.actors,
            imageUrl: mockMovie.imageUrl,
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
          .expectJsonLike({
            message: ['rating must not be less than 1'],
          });
      });

      it('should not create a movie when rating is greater than 5', () => {
        return pactum
          .spec()
          .post(moviesRoute)
          .withHeaders({ Authorization: 'Bearer $S{bearer_token}' })
          .withBody({
            title: mockMovie.title,
            description: mockMovie.description,
            releaseDate: mockMovie.releaseDate,
            rating: 6,
            gender: mockMovie.gender,
            actors: mockMovie.actors,
            imageUrl: mockMovie.imageUrl,
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
          .expectJsonLike({
            message: ['rating must not be greater than 5'],
          });
      });

      it('should not create a movie when gender is empty', () => {
        return pactum
          .spec()
          .post(moviesRoute)
          .withHeaders({ Authorization: 'Bearer $S{bearer_token}' })
          .withBody({
            title: mockMovie.title,
            description: mockMovie.description,
            releaseDate: mockMovie.releaseDate,
            rating: mockMovie.rating,
            actors: mockMovie.actors,
            imageUrl: mockMovie.imageUrl,
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
          .expectJsonLike({
            message: [
              'gender should not be empty',
              'gender must be one of the following values: Male, Female, Others',
            ],
          });
      });

      it('should not create a movie when gender does not conform with enum', () => {
        return pactum
          .spec()
          .post(moviesRoute)
          .withHeaders({ Authorization: 'Bearer $S{bearer_token}' })
          .withBody({
            title: mockMovie.title,
            description: mockMovie.description,
            releaseDate: mockMovie.releaseDate,
            rating: mockMovie.rating,
            gender: 'NotAGenderEnum',
            actors: mockMovie.actors,
            imageUrl: mockMovie.imageUrl,
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
          .expectJsonLike({
            message: [
              'gender must be one of the following values: Male, Female, Others',
            ],
          });
      });

      it('should not create a movie when actors is empty', () => {
        return pactum
          .spec()
          .post(moviesRoute)
          .withHeaders({ Authorization: 'Bearer $S{bearer_token}' })
          .withBody({
            title: mockMovie.title,
            description: mockMovie.description,
            releaseDate: mockMovie.releaseDate,
            rating: mockMovie.rating,
            gender: mockMovie.gender,
            imageUrl: mockMovie.imageUrl,
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
          .expectJsonLike({
            message: ['actors should not be empty'],
          });
      });

      it('should not create a movie when actors is not an array', () => {
        return pactum
          .spec()
          .post(moviesRoute)
          .withHeaders({ Authorization: 'Bearer $S{bearer_token}' })
          .withBody({
            title: mockMovie.title,
            description: mockMovie.description,
            releaseDate: mockMovie.releaseDate,
            rating: mockMovie.rating,
            gender: mockMovie.gender,
            actors: 'notanarray',
            imageUrl: mockMovie.imageUrl,
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
          .expectJsonLike({
            message: ['actors must be an array'],
          });
      });

      it('should not create a movie when actors array is not a string', () => {
        return pactum
          .spec()
          .post(moviesRoute)
          .withHeaders({ Authorization: 'Bearer $S{bearer_token}' })
          .withBody({
            title: mockMovie.title,
            description: mockMovie.description,
            releaseDate: mockMovie.releaseDate,
            rating: mockMovie.rating,
            gender: mockMovie.gender,
            actors: [1, 2, 3],
            imageUrl: mockMovie.imageUrl,
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
          .expectJsonLike({
            message: ['each value in actors must be a string'],
          });
      });

      it('should not create a movie when image url is empty', () => {
        return pactum
          .spec()
          .post(moviesRoute)
          .withHeaders({ Authorization: 'Bearer $S{bearer_token}' })
          .withBody({
            title: mockMovie.title,
            description: mockMovie.description,
            releaseDate: mockMovie.releaseDate,
            rating: mockMovie.rating,
            gender: mockMovie.gender,
            actors: mockMovie.actors,
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
          .expectJsonLike({
            message: ['imageUrl should not be empty'],
          });
      });

      it('should not create a movie if image url is not a Url address', () => {
        return pactum
          .spec()
          .post(moviesRoute)
          .withHeaders({ Authorization: 'Bearer $S{bearer_token}' })
          .withBody({
            title: mockMovie.title,
            description: mockMovie.description,
            releaseDate: mockMovie.releaseDate,
            rating: mockMovie.rating,
            gender: mockMovie.gender,
            actors: mockMovie.actors,
            imageUrl: 'notavalidurl',
          })
          .expectStatus(HttpStatus.BAD_REQUEST)
          .expectJsonLike({
            message: ['imageUrl must be a URL address'],
          });
      });

      it('should create a movie', () => {
        return pactum
          .spec()
          .post(moviesRoute)
          .withHeaders({ Authorization: 'Bearer $S{bearer_token}' })
          .withBody(mockMovie)
          .expectStatus(HttpStatus.CREATED)
          .expectBodyContains(mockMovie.title)
          .stores('movieId', '_id');
      });
    });

    it('should get movies', () => {
      return pactum
        .spec()
        .get(moviesRoute)
        .expectStatus(HttpStatus.OK)
        .expectJsonLength(1)
        .expectBodyContains('$S{movieId}')
        .expectBodyContains('$S{userId}');
    });

    describe('Update movie', () => {
      it('should not update movie if user is not owner', async () => {
        // reate new user and use the new user bearer token to update a movie that was not created by the user.
        await pactum
          .spec()
          .post(registerRoute)
          .withBody({
            email: 'newuser@gmail.com',
            firstName: 'John',
            lastName: 'Appleseed',
            password: '$Password1.',
          })
          .expectStatus(HttpStatus.CREATED)
          .stores('new_bearer_token', 'token');
        return pactum
          .spec()
          .patch(`${moviesRoute}/{id}`)
          .withPathParams('id', '$S{movieId}')
          .withHeaders({ Authorization: 'Bearer $S{new_bearer_token}' })
          .withBody({ title: 'Updated Movie Title' })
          .expectStatus(HttpStatus.FORBIDDEN)
          .expectJsonLike({
            message: 'You are unauthorized to access this resource.',
          });
      });

      it('should not update movie if movie id does not exist', () => {
        return pactum
          .spec()
          .patch(`${moviesRoute}/{id}`)
          .withPathParams('id', new mongoose.Types.ObjectId()) // use a non existing, random objectId
          .withHeaders({ Authorization: 'Bearer $S{new_bearer_token}' })
          .withBody({ title: 'Updated Movie Title' })
          .expectStatus(HttpStatus.FORBIDDEN)
          .expectJsonLike({
            message: 'You are unauthorized to access this resource.',
          });
      });

      it('should update movie', () => {
        return pactum
          .spec()
          .patch(`${moviesRoute}/{id}`)
          .withPathParams('id', '$S{movieId}') // use a non existing, random objectId
          .withHeaders({ Authorization: 'Bearer $S{bearer_token}' })
          .withBody({ title: 'Updated Movie Title' })
          .expectStatus(HttpStatus.OK)
          .expectBodyContains('Updated Movie Title');
      });
    });

    describe('Delete movie', () => {
      it('should not delete movie if user is not owner', () => {
        return pactum
          .spec()
          .delete(`${moviesRoute}/{id}`)
          .withPathParams('id', '$S{movieId}')
          .withHeaders({ Authorization: 'Bearer $S{new_bearer_token}' })
          .expectStatus(HttpStatus.FORBIDDEN)
          .expectJsonLike({
            message: 'You are unauthorized to access this resource.',
          });
      });

      it('should not delete movie if movie id does not exist', () => {
        return pactum
          .spec()
          .delete(`${moviesRoute}/{id}`)
          .withPathParams('id', new mongoose.Types.ObjectId()) // use a non existing, random objectId
          .withHeaders({ Authorization: 'Bearer $S{new_bearer_token}' })
          .expectStatus(HttpStatus.FORBIDDEN)
          .expectJsonLike({
            message: 'You are unauthorized to access this resource.',
          });
      });

      it('should delete movie', async () => {
        return pactum
          .spec()
          .patch(`${moviesRoute}/{id}`)
          .withPathParams('id', '$S{movieId}') // use a non existing, random objectId
          .withHeaders({ Authorization: 'Bearer $S{bearer_token}' })
          .expectStatus(HttpStatus.OK)
          .expectBodyContains('$S{movieId}');
      });
    });
  });
});
