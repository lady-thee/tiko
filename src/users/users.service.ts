/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/app.service';
import { CreateUserDto } from './dtos/create.dto';
import { ServerHTTPResponse } from 'src/main.dtos';
import { Roles } from '@prisma/client';
import { generateSixRandomNumbers } from 'src/lib/user.helper';

// export async function createUser(data: any){
//   const user = await prisma.user.create({
//       data: {
//         email,
//         username,
//         role: roles.MANAGER,
//         ...data,
//       },
//     });
// }
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private async _createUser(data: any) {
    const user = await this.prisma.user.create({ data });
    return user;
  }

  async createManager(
    createUserDto: CreateUserDto,
  ): Promise<ServerHTTPResponse> {
    const { email, username, ...data } = createUserDto;
    const roles = Roles;

    // Check if the user already exists
    const existingUserEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUserEmail) {
      return {
        status: 400,
        message: 'User already exists',
      };
    }

    // Check if the username already exists
    const existingUserUsername = await this.prisma.user.findUnique({
      where: { username },
    });
    if (existingUserUsername) {
      return {
        status: 400,
        message: 'Username already exists',
      };
    }

    // Check if the email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        status: 400,
        message: 'Invalid email format',
      };
    }

    // Check if the username is valid
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return {
        status: 400,
        message: 'Invalid username format',
      };
    }

    // Create activation code
    const activationCode = generateSixRandomNumbers();
    const activationCodeString = activationCode.join('');

    // Create user
    try {
      // Create the user
      const user = await this._createUser({
        email,
        username,
        activationCode: activationCodeString,
        role: roles.MANAGER,
        ...data,
      });

      return {
        status: 201,
        message: 'User created successfully',
        data: user,
      };
    } catch (error: unknown) {
      let errorMessage = 'An unexpected error occurred';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      return {
        status: 500,
        message: 'Internal server error',
        error: errorMessage,
      };
    }
  }
}
