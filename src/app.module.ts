import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService, PrismaService } from './app.service';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EncryptionModule } from '@hedger/nestjs-encryption';
import { JWTUtilService } from './lib/utils.helper';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration available globally
      // envFilePath: '../.env', // Path to environment variables file
    }),
    EncryptionModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService], // Inject ConfigService to access environment variables
      useFactory: (configService: ConfigService) => ({
        key: configService.get<string>('ENCRYPTION_KEY') || 'null',
      }),
    }),
  ],
  exports: [PrismaService],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    UsersService,
    JWTUtilService,
    JwtService,
  ],
})
export class AppModule {}
