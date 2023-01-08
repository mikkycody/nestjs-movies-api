import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import * as mongoose from 'mongoose';
import { LoginUserDto, RegisterUserDto } from 'src/auth/dto';
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

  // it('should return all movies (empty)', () => {
  // return server.get('/movies').expect(200).expect([]);
  // });
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
          .post('auth/register')
          .expectStatus(400)
          .expectJsonLike({
            message: [
              'email must be an email',
              'email should not be empty',
              'password should not be empty',
              'password must be a string',
              'password not strong enough',
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
          .post('auth/register')
          .withBody({
            password: mockUserDto.password,
            firstName: mockUserDto.firstName,
            lastName: mockUserDto.lastName,
          })
          .expectStatus(400)
          .expectJsonLike({
            message: ['email must be an email', 'email should not be empty'],
          });
      });

      it('should not sign up if email is not a valid email', () => {
        return pactum
          .spec()
          .post('auth/register')
          .withBody({
            email: 'invalid',
            password: mockUserDto.password,
            firstName: mockUserDto.firstName,
            lastName: mockUserDto.lastName,
          })
          .expectStatus(400)
          .expectJsonLike({
            message: ['email must be an email'],
          });
      });

      it('should not sign up if password is empty', () => {
        return pactum
          .spec()
          .post('auth/register')
          .withBody({
            email: mockUserDto.email,
            firstName: mockUserDto.firstName,
            lastName: mockUserDto.lastName,
          })
          .expectStatus(400)
          .expectJsonLike({
            message: ['password should not be empty'],
          });
      });

      it('should not sign up if password is not strong enough', () => {
        return pactum
          .spec()
          .post('auth/register')
          .withBody({
            email: mockUserDto.email,
            password: 'weak',
            firstName: mockUserDto.firstName,
            lastName: mockUserDto.lastName,
          })
          .expectStatus(400)
          .expectJsonLike({
            message: [
              'password not strong enough',
              'password must be longer than or equal to 8 characters',
            ],
          });
      });

      it('should not sign up if first name is empty', () => {
        return pactum
          .spec()
          .post('auth/register')
          .withBody({
            email: mockUserDto.email,
            password: mockUserDto.password,
            lastName: mockUserDto.lastName,
          })
          .expectStatus(400)
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
          .post('auth/register')
          .withBody({
            email: mockUserDto.email,
            password: mockUserDto.password,
            firstName: mockUserDto.firstName,
          })
          .expectStatus(400)
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
          .post('auth/register')
          .withBody({
            email: mockUserDto.email,
            password: mockUserDto.password,
            firstName: mockUserDto.firstName,
          })
          .expectStatus(400)
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
          .post('auth/register')
          .withBody(mockUserDto)
          .expectStatus(201)
          .expectJsonLike({
            email: mockUserDto.email,
            firstName: mockUserDto.firstName,
            lastName: mockUserDto.lastName,
          });
      });

      it('should not sign up if email is taken', () => {
        return pactum
          .spec()
          .post('auth/register')
          .withBody(mockUserDto)
          .expectStatus(409)
          .expectJsonLike({
            message: 'email has been taken',
          });
      });

      it('should not sign in if body is empty', () => {
        return pactum
          .spec()
          .post('auth/login')
          .expectStatus(400)
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
          .post('auth/login')
          .withBody({
            password: mockUserDto.password,
          })
          .expectStatus(400)
          .expectJsonLike({
            message: ['email must be an email', 'email should not be empty'],
          });
      });

      it('should not sign in if email is not a valid email', () => {
        return pactum
          .spec()
          .post('auth/login')
          .withBody({
            email: 'invalid',
            password: mockUserDto.password,
          })
          .expectStatus(400)
          .expectJsonLike({
            message: ['email must be an email'],
          });
      });

      it('should not sign in if password is empty', () => {
        return pactum
          .spec()
          .post('auth/login')
          .withBody({
            email: mockUserDto.email,
          })
          .expectStatus(400)
          .expectJsonLike({
            message: ['password should not be empty'],
          });
      });

      it('should not sign in if email does not exist', () => {
        return pactum
          .spec()
          .post('auth/login')
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
          .post('auth/login')
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
          .post('auth/login')
          .withBody({
            email: mockUserDto.email,
            password: mockUserDto.password,
          })
          .expectStatus(200)
          .expectJsonLike({
            email: mockUserDto.email,
            firstName: mockUserDto.firstName,
            lastName: mockUserDto.lastName,
          }).stores('bearer_token', 'token');
      });
    });
  });
});
