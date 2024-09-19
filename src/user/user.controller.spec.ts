import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../user/user.service';
import { User } from '../user/entity/user.entity';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;
  let authController: AuthController;

  const mockUserService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController, AuthController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    authController = module.get<AuthController>(AuthController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of users with a 200 status', async () => {
      const result: User[] = [
        {
          id: 1,
          firstname: 'User 1',
          middlename: 'User 1',
          lastname: 'User 1',
          sex: 'male',
          dob: new Date(),
          email: 'meow',
          password: 'ajsndnjdska',
          role: 'admin',
        },
      ];
      jest.spyOn(userService, 'findAll').mockResolvedValue(result);

      const response = await controller.findAll();

      expect(response).toEqual({
        message: 'ok',
        statusCode: 200,
        data: result,
      });
      expect(userService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user by id', async () => {
      const result = {
        id: 1,
        firstname: 'User 1',
        middlename: 'User 1',
        lastname: 'User 1',
        sex: 'male',
        dob: new Date(),
        email: 'meow100@gmail.com',
        password: 'ajsndnjdska',
        role: 'admin',
      };
      jest.spyOn(userService, 'findOne').mockResolvedValue(result);

      const response = await controller.findOne(1);

      expect(response).toBe(result);
      expect(userService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const user: User = {
        id: 1,
        firstname: 'User 1',
        middlename: 'User 1',
        lastname: 'User 1',
        sex: 'male',
        dob: new Date(),
        email: 'meow24234@gmail.com',
        password: 'ajsndnjdska',
        role: 'admin',
      };

      const userDto = {
        message: 'User registration successful',
        statusCode: 201,
        data: user,
      };

      jest.spyOn(userService, 'create').mockResolvedValue(user);

      const response = await authController.register(user);

      expect(response).toEqual(userDto);
      expect(userService.create).toHaveBeenCalledWith(userDto);
    });
  });
});
