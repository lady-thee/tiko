import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/app.service';
import { CreateUserDto } from './dtos/create.dto';
// import { User } from '@prisma/client';
import { ClientHTTPResponse } from 'src/main.dtos';
import { ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('/manager/create')
  @ApiOperation({
    summary: 'Create a new manager',
    description: 'Create a new manager with the provided details',
  })
  async createManagerController(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ClientHTTPResponse> {
    return this.usersService.createManager(createUserDto);
  }
}
