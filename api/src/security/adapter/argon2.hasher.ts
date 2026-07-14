import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PasswordHasherPort } from '../../user/domain/port/password-hasher.port';
import { PasswordVerifierPort } from '../../auth/domain/port/password-verifier.port';

@Injectable()
export class Argon2Hasher implements PasswordHasherPort, PasswordVerifierPort {
  async hash(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19456,   
      timeCost: 2,
      parallelism: 1,
    });
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await argon2.verify(hashedPassword, password);
    } catch {
      return false;
    }
  }
}