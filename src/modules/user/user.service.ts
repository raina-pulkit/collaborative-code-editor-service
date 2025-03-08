import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Creates a new user or updates an existing user
   * @param createUserDto - The user details to create or update
   * @returns The created or updated user
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const userExists = await this.userRepository.findOne({
      where: { githubId: createUserDto.githubId },
    });

    if (userExists) {
      // update the user
      return this.update(userExists.id, {
        ...createUserDto,
        id: userExists.id,
      });
    }

    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  /**
   * Finds all users
   * @returns All users
   */
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * Finds a user by ID
   * @param id - The ID of the user to find
   * @returns The user with the given ID
   */
  findOneByUuid(uuid: string): Promise<User> {
    return this.userRepository.findOne({ where: { id: uuid } });
  }

  /**
   * Finds a user by ID
   * @param id - The ID of the user to find
   * @returns The user with the given ID
   */
  findOneById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { githubId: id } });
  }

  /**
   * Updates a user
   * @param updateUserDto - The user details to update
   * @returns The updated user
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const userExists = await this.userRepository.findOne({
      where: { id: id ?? updateUserDto.id },
    });

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    if (userExists.deletedAt) {
      throw new BadRequestException('User is deleted');
    }

    return this.userRepository.save({
      ...userExists,
      ...updateUserDto,
    });
  }

  /**
   * Removes a user
   * @param id - The ID of the user to remove
   * @returns The removed user
   */
  async remove(id: string): Promise<DeleteResult> {
    const userExists = await this.userRepository.findOne({
      where: { id },
    });

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    if (userExists.deletedAt) {
      throw new BadRequestException('User is already deleted');
    }

    return this.userRepository.softDelete(id);
  }

  getDetails(token: string): User {
    const jwtSecret = process.env.JWT_SECRET;
    const userDetails: User = <User>jwt.verify(token, jwtSecret, {
      algorithms: ['HS256'],
    });

    throw new BadRequestException('Not implemented');

    return userDetails;
  }
}
