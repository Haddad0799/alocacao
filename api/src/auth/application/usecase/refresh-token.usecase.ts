
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { USER_CREDENTIALS } from '../../domain/port/user-credentials.port';
import type { UserCredentialsPort } from '../../domain/port/user-credentials.port';
import { TOKEN_SIGNER } from '../../domain/port/token-signer.port';
import type { TokenSignerPort, AuthTokens } from '../../domain/port/token-signer.port';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(USER_CREDENTIALS)
    private readonly credentials: UserCredentialsPort,
    @Inject(TOKEN_SIGNER)
    private readonly signer: TokenSignerPort,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async execute(refreshToken: string): Promise<AuthTokens> {
    let payload: { sub: string; type: string };

    try {
      payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException();
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException();
    }

    const found = await this.credentials.findById(payload.sub);
    if (!found) {
      throw new UnauthorizedException();
    }

    return this.signer.sign({ sub: found.id, role: found.role });
  }
}