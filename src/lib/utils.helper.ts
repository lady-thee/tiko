import { EncryptionService } from '@hedger/nestjs-encryption';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from 'src/main.dtos';
import * as argon from 'argon2';

@Injectable()
export class JWTUtilService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cryptService: EncryptionService,
  ) {}

  /**
   * Generates a JWT token with the provided payload and expiration time.
   * @param payload - The payload to include in the JWT token.
   * @param expiresIn - The expiration time for the token (default is '12h').
   * @returns A promise that resolves to the generated JWT token.
   */
  async generateJwtToken(
    payload: object,
    expiresIn: string = '12h',
  ): Promise<string> {
    try {
      if (!payload || typeof payload !== 'object') {
        throw new Error('Invalid payload for JWT token generation');
      }
      const secret = this.configService.get<string>('JWT_SECRET');
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: expiresIn,
        algorithm: 'HS256',
        secret: secret,
      });
      return token;
    } catch (error) {
      console.error('Error generating JWT token:', error);
      throw new Error('Failed to generate JWT token');
    }
  }

  /**
   * Verifies a JWT token and returns the decoded payload.
   * @param token - The JWT token to verify.
   * @returns A promise that resolves to the decoded payload if verification is successful.
   * @throws An error if the token is invalid or expired.
   */
  async verifyJWTToken(token: string): Promise<any> {
    try {
      if (!token) {
        throw new Error('JWT token is required for verification');
      }
      const secret = this.configService.get<string>('JWT_SECRET');

      const decoded_token = await this.jwtService.verifyAsync<JWTPayload>(
        token,
        {
          secret: secret,
          algorithms: ['HS256'],
        },
      );
      return decoded_token;
    } catch (error) {
      console.error('Error verifying JWT token:', error);
      throw new Error('Invalid or expired JWT token');
    }
  }

  /**
   * Decodes a JWT token without verifying its signature.
   * @param token - The JWT token to decode.
   * @returns A promise that resolves to the decoded payload.
   */
  decodeJWTToken(token: string): Promise<any> {
    try {
      if (!token) {
        throw new Error('JWT token is required for decoding');
      }

      const decoded_token = this.jwtService.decode<JWTPayload>(token, {
        complete: true,
        json: true,
      });

      return Promise.resolve(decoded_token);
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      throw new Error('Failed to decode JWT token');
    }
  }

  /**
   * Encrypts a JWT token using the configured encryption service.
   * @param token - The JWT token to encrypt.
   * @returns A promise that resolves to the encrypted JWT token.
   */
  encryptJWTToken(token: string): Promise<string> {
    try {
      if (!token) {
        throw new Error('JWT token is required for hashing');
      }
      const encryptedToken = this.cryptService.encrypt(token);

      return Promise.resolve(encryptedToken);
    } catch (error) {
      console.error('Error hashing JWT token:', error);
      throw new Error('Failed to hash JWT token');
    }
  }

  /**
   * Decrypts an encrypted JWT token using the configured encryption service.
   * @param encryptedToken - The encrypted JWT token to decrypt.
   * @returns A promise that resolves to the decrypted JWT token.
   */
  decryptJWTToken(encryptedToken: string): Promise<string> {
    try {
      if (!encryptedToken) {
        throw new Error('Encrypted JWT token is required for decryption');
      }
      const decryptedToken = this.cryptService.decrypt(encryptedToken);
      return Promise.resolve(decryptedToken);
    } catch (error) {
      console.error('Error decrypting JWT token:', error);
      throw new Error('Failed to decrypt JWT token');
    }
  }

  /**
   * Hashes an encrypted JWT token using Argon2.
   * @param encryptedToken - The encrypted JWT token to hash.
   * @returns A promise that resolves to the hashed token.
   */
  async hashEncryptedJWTToken(encryptedToken: string): Promise<string> {
    try {
      if (!encryptedToken) {
        throw new Error('Encrypted JWT token is required for hashing');
      }
      const hashedToken = await argon.hash(encryptedToken);
      return hashedToken;
    } catch (error) {
      throw new Error('Failed to hash encrypted JWT token: ' + error);
    }
  }
}
