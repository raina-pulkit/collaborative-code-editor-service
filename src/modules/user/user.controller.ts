import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiOkResponse } from '@nestjs/swagger';
import { parameterValidator } from 'config/validator';
import { JWTGuard } from 'modules/github-auth/auth.guard';
import { DeleteResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('v1/user')
@UseGuards(JWTGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOkResponse({ description: 'Successfully created a new user', type: User })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiExcludeEndpoint()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Successfully fetched a user', type: User })
  findOne(@Param('id', parameterValidator()) id: string): Promise<User> {
    return this.userService.findOneByUuid(id);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Successfully updated a user', type: User })
  update(
    @Param('id', parameterValidator()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Successfully deleted a user',
    type: DeleteResult,
  })
  remove(@Param('id', parameterValidator()) id: string): Promise<DeleteResult> {
    return this.userService.remove(id);
  }

  @Get('get-data')
  @ApiOkResponse({
    description: 'Successfully fetched user details',
    type: User,
  })
  getData(@Headers() authData: any): Promise<User> {
    return this.userService.getDetails(
      (authData.authorization as string).split(' ')[1],
    );
  }
}
