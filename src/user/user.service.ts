import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  findOne(id: number): Promise<User> {
    return this.userRepo.findOneBy({ id });
  }

  async create(user: User): Promise<User> {
    const salt = Number(process.env.SALT);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    return this.userRepo.save({
      ...user,
      password: hashedPassword,
    });
  }

  async update(id: number, user: User): Promise<User> {
    const updatedUser = await this.userRepo.preload({
      id: id,
      ...user,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.userRepo.save(updatedUser);
  }

  delete(id: number): string {
    this.userRepo.delete(id);

    return 'user deleted';
  }
}
