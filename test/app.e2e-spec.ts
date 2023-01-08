import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import * as mongoose from 'mongoose';
import { LoginUserDto, RegisterUserDto } from 'src/auth/dto';
import * as pactum from 'pactum';

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
    const registerDto: RegisterUserDto = {
      email: 'test@gmail.com',
      password: '$Password1#',
      firstName: 'John',
      lastName: 'Doe',
    };

    const loginDto: LoginUserDto = {
      email: 'test@gmail.com',
      password: 'password',
    };
    describe('Signup', () => {
      it('should not signup if body is empty', () => {
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
              'firstName should not be empty',
              'firstName must be a string',
              'lastName should not be empty',
              'lastName must be a string',
            ],
          });
      });

      it('should not signup if email is empty', () => {
        return pactum
          .spec()
          .post('auth/register')
          .withBody({
            password: registerDto.password,
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
          })
          .expectStatus(400)
          .expectJsonLike({
            message: ['email must be an email', 'email should not be empty'],
          });
      });

      it('should not signup if email is not a valid email', () => {
        return pactum
          .spec()
          .post('auth/register')
          .withBody({
            email: 'invalid',
            password: registerDto.password,
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
          })
          .expectStatus(400)
          .expectJsonLike({
            message: ['email must be an email'],
          });
      });

      it('should not signup if password is empty', () => {
        return pactum
          .spec()
          .post('auth/register')
          .withBody({
            email: registerDto.email,
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
          })
          .expectStatus(400)
          .expectJsonLike({
            message: ['password should not be empty'],
          });
      });

      it('should not signup if password is not strong enough', () => {
        return pactum
          .spec()
          .post('auth/register')
          .withBody({
            email: registerDto.email,
            password: 'weak',
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
          })
          .expectStatus(400)
          .expectJsonLike({
            message: [
              'password not strong enough',
              'password must be longer than or equal to 8 characters',
            ],
          });
      });

      it('should not signup if first name is empty', () => {
        return pactum
          .spec()
          .post('auth/register')
          .withBody({
            email: registerDto.email,
            password: registerDto.password,
            lastName: registerDto.lastName,
          })
          .expectStatus(400)
          .expectJsonLike({
            message: [
              'firstName should not be empty',
              'firstName must be a string',
            ],
          });
      });

      it('should not signup if last name is empty', () => {
        return pactum
          .spec()
          .post('auth/register')
          .withBody({
            email: registerDto.email,
            password: registerDto.password,
            firstName: registerDto.firstName,
          })
          .expectStatus(400)
          .expectJsonLike({
            message: [
              'lastName should not be empty',
              'lastName must be a string',
            ],
          });
      });

      it('should not signup if last name is empty', () => {
        return pactum
          .spec()
          .post('auth/register')
          .withBody({
            email: registerDto.email,
            password: registerDto.password,
            firstName: registerDto.firstName,
          })
          .expectStatus(400)
          .expectJsonLike({
            message: [
              'lastName should not be empty',
              'lastName must be a string',
            ],
          });
      });
    });
  });
});
