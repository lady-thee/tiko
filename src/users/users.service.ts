/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/app.service';
import { CreateUserDto } from './dtos/create.dto';
import { ServerHTTPResponse } from 'src/main.dtos';

import { Roles, Prisma } from '@prisma/client';
import { generateSixRandomNumbers } from 'src/lib/user.helper';
import { get_response, StatusCode } from 'src/lib/response.helper';
import { JWTUtilService } from 'src/lib/utils.helper';
import { addHours } from 'date-fns';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtUtils: JWTUtilService,
  ) {}

  private async _createUser(tx: Prisma.TransactionClient, data: any) {
    const user = await tx.user.create({ data });
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<ServerHTTPResponse> {
    const { email, username, inviteCode, ...data } = createUserDto;
    const roles = Roles;

    if (!email || !username) {
      return get_response(
        StatusCode.BadRequest,
        'Email and username are required',
      );
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
      return get_response(
        StatusCode.BadRequest,
        'Username can only contain letters, numbers, and underscores',
      );
    }

    // Check if the user already exists
    const existingUserEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUserEmail) {
      return get_response(StatusCode.BadRequest, 'Email already exists');
    }

    // Check if the username already exists
    const existingUserUsername = await this.prisma.user.findUnique({
      where: { username },
    });
    if (existingUserUsername) {
      return get_response(StatusCode.BadRequest, 'Username already exists');
    }

    // Create activation code
    const activationCode = generateSixRandomNumbers();
    const activationCodeString = activationCode.join('');

    try {
      let user = null;
      const currentDate = new Date();
      const currentTime = addHours(currentDate, 1);

      const response = await this.prisma.$transaction(async (tx) => {
        if (inviteCode) {
          const existingInviteCode = await tx.inviteCodes.findUnique({
            where: { token: inviteCode },
            include: {
              company: true,
            },
          });
          if (!existingInviteCode) {
            return get_response(StatusCode.BadRequest, 'Invalid invite code');
          }

          const hashedToken =
            await this.jwtUtils.hashEncryptedJWTToken(inviteCode);

          if (
            existingInviteCode?.token &&
            hashedToken !== existingInviteCode?.token
          ) {
            return get_response(StatusCode.BadRequest, 'Token mismatch');
          } else if (
            existingInviteCode?.expiryDate &&
            existingInviteCode?.expiryDate < currentTime
          ) {
            await tx.inviteCodes.update({
              where: { id: existingInviteCode.id },
              data: {
                isExpired: true,
              },
            });
            return get_response(
              StatusCode.BadRequest,
              'Invite code has expired',
            );
          } else {
            user = await this._createUser(tx, {
              email,
              username,
              activationCode: activationCodeString,
              role: roles.EMPLOYEE,
              company: { connect: { id: existingInviteCode.company.id } },
              ...data,
            });
          }
        } else {
          user = await this._createUser(tx, {
            email,
            username,
            activationCode: activationCodeString,
            role: roles.SOLO,
            ...data,
          });
        }

        return get_response(
          StatusCode.Created,
          'User created successfully',
          user,
        );
      });

      return response; // Return the response from the transaction
    } catch (error) {
      return get_response(
        StatusCode.InternalServerError,
        'An unexpected error occurred while creating the user',
        {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      );
    }
  }
}
