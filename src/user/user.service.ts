import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';

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

  create(user: User): Promise<User> {
    return this.userRepo.save(user);
  }

  update(user: User): Promise<User> {
    return this.userRepo.save(user);
  }

  delete(id: number): string {
    this.userRepo.delete(id);

    return 'user deleted';
  }
}
