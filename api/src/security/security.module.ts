// security/security.module.ts
import { Module } from '@nestjs/common';
import { Argon2Hasher } from './adapter/argon2.hasher';
import { PASSWORD_HASHER } from '../user/domain/port/password-hasher.port';
import { PASSWORD_VERIFIER } from '../auth/domain/port/password-verifier.port';

@Module({
  providers: [
    Argon2Hasher,                                          
    { provide: PASSWORD_HASHER, useExisting: Argon2Hasher },
    { provide: PASSWORD_VERIFIER, useExisting: Argon2Hasher },
  ],
  exports: [PASSWORD_HASHER, PASSWORD_VERIFIER],
})
export class SecurityModule {}