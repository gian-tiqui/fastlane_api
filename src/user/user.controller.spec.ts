import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
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
          name: 'User 1',
          email: 'meow',
          password: 'ajsndnjdska',
          role: 'admin',
        },
      ];
      jest.spyOn(userService, 'findAll').mockResolvedValue(result); // Mock the service method

      const response = await controller.findAll();

      expect(response).toEqual({
        message: 'ok',
        status: 200,
        data: result,
      });
      expect(userService.findAll).toHaveBeenCalled(); // Ensure the service method was called
    });
  });

  describe('findOne', () => {
    it('should return a single user by id', async () => {
      const result = {
        id: 1,
        name: 'User 1',
        email: 'meow',
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
      const userDto: User = {
        id: 1,
        name: 'User 1',
        email: 'meow',
        password: 'ajsndnjdska',
        role: 'admin',
      };
      jest.spyOn(userService, 'create').mockResolvedValue(userDto);

      const response = await controller.create(userDto);

      expect(response).toBe(userDto);
      expect(userService.create).toHaveBeenCalledWith(userDto);
    });
  });
});
