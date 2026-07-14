
import { Inject, Injectable } from '@nestjs/common';
import { USER_CREDENTIALS } from '../../domain/port/user-credentials.port';
import type { UserCredentialsPort } from '../../domain/port/user-credentials.port';
import { PASSWORD_VERIFIER } from '../../domain/port/password-verifier.port';
import type { PasswordVerifierPort } from '../../domain/port/password-verifier.port';
import { TOKEN_SIGNER } from '../../domain/port/token-signer.port';
import type { TokenSignerPort, AuthTokens } from '../../domain/port/token-signer.port';
import { InvalidCredentialsException } from '../../domain/exception/invalid-credentials.exception';
import { LoginCommand } from '../command/login.command';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_CREDENTIALS)
    private readonly credentials: UserCredentialsPort,
    @Inject(PASSWORD_VERIFIER)
    private readonly verifier: PasswordVerifierPort,
    @Inject(TOKEN_SIGNER)
    private readonly signer: TokenSignerPort,
  ) {}

  async execute(command: LoginCommand): Promise<AuthTokens> {
    const found = await this.credentials.findByEmail(command.email);

    if (!found) {
      throw new InvalidCredentialsException();
    }

    const matches = await this.verifier.compare(
      command.password,
      found.passwordHash,
    );

    if (!matches) {
      throw new InvalidCredentialsException();
    }

    return this.signer.sign({ sub: found.id, role: found.role });
  }
}