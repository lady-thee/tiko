import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/app.service';
import { JWTUtilService } from 'src/lib/utils.helper';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, JWTUtilService, JwtService],
})
export class UsersModule {}
