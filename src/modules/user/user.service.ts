import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDetails } from 'src/types/user/user-details';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  getDetails(token: string): UserDetails {
    const jwtSecret = process.env.JWT_SECRET;
    const userDetails: UserDetails = jwt.verify(token, jwtSecret, {
      algorithms: ['HS256'],
    }) as UserDetails;

    return userDetails;
  }
}
