import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { User } from 'src/interfaces';
import { AuthService } from './auth.service';
import { ForbiddenException } from '@nestjs/common';

const mockUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@test.com',
  password: '$hashedpassword',
};
describe('AuthService', () => {
  let service: AuthService;
  let model: Model<User>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'USER_MODEL',
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser),
            constructor: jest.fn().mockResolvedValue(mockUser),
            findOne: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    model = module.get<Model<User>>('USER_MODEL');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a user', async () => {
    jest.spyOn(model, 'create').mockImplementationOnce(() =>
      Promise.resolve({
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@test.com',
        password: '$hashedpassword',
      }),
    );
    const user = await service.register({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@test.com',
      password: 'password',
    });
    expect(user).toEqual(mockUser);
  });

  it('should login a user', async () => {
    jest.spyOn(model, 'findOne').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(mockUser),
    } as any);
    jest.spyOn(service, 'verifyPassword').mockResolvedValue(true);
    const user = await service.login({
      email: 'johndoe@test.com',
      password: 'password',
    });
    expect(user).toEqual(mockUser);
  });

  it('should not login a user with wrong password', async () => {
    jest.spyOn(model, 'findOne').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(mockUser),
    } as any);
    jest.spyOn(service, 'verifyPassword').mockResolvedValue(false);
    await expect(
      service.login({
        email: 'johndoe@test.com',
        password: 'password',
      }),
    ).rejects.toThrowError(ForbiddenException);
  });

  it('should not login a user not found', async () => {
    jest.spyOn(model, 'findOne').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(null),
    } as any);
    await expect(
      service.login({
        email: 'johndoe@test.com',
        password: 'password',
      }),
    ).rejects.toThrowError(ForbiddenException);
  });
});
