import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserDetails } from 'types/user/user-details';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  create(_createUserDto: CreateUserDto): string {
    return 'This action adds a new user';
  }

  findAll(): string {
    return `This action returns all user`;
  }

  findOne(id: number): string {
    return `This action returns a #${id} user`;
  }

  update(id: number, _updateUserDto: UpdateUserDto): string {
    return `This action updates a #${id} user`;
  }

  remove(id: number): string {
    return `This action removes a #${id} user`;
  }

  getDetails(token: string): UserDetails {
    const jwtSecret = process.env.JWT_SECRET;
    const userDetails: UserDetails = jwt.verify(token, jwtSecret, {
      algorithms: ['RS256'],
    }) as UserDetails;

    return userDetails;
  }
}
