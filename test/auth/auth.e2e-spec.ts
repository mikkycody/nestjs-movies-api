import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../../src/app.module';
import * as mongoose from 'mongoose';
import { RegisterUserDto } from './../../src/auth/dto';
import * as pactum from 'pactum';
import { MongoExceptionFilter } from '../../src/exceptions';

async function refreshDB() {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
}

describe('AuthController (e2e)', () => {
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

  afterAll(async () => {
    await app.close();
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
          .stores('bearerToken', 'token')
          .stores('userId', 'id');
      });
    });
  });
});
