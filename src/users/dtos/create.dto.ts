import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// export enum Roles {
//   SUPERADMIN = 1,
//   ADMIN = 2,
//   MANAGER = 3,
//   EMPLOYEE = 4,
// }

export class CreateUserDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'johndoe1@example.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Invite code for the user',
    example: 'INVITE123',
    required: false,
  })
  @IsString()
  @IsOptional()
  inviteCode?: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
    required: true,
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
    required: true,
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Username of the user',
    example: 'johndoe1',
    required: true,
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '+1234567890',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'password123',
    required: false,
  })
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty({
    description: 'Occupation of the user',
    example: 'Software Engineer',
    required: false,
  })
  @IsString()
  @IsOptional()
  occupation?: string;

  @ApiProperty({
    description: 'Country name of the user',
    example: 'Nigeria',
    required: false,
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({
    description: 'State name of the user',
    example: 'Lagos',
    required: false,
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    description: 'Address of the user',
    example: '123 Main St, Lagos',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;
}
