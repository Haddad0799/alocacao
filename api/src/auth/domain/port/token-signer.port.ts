// auth/domain/port/token-signer.port.ts
export const TOKEN_SIGNER = Symbol('TOKEN_SIGNER');

export interface AuthTokens {
  readonly accessToken: string;
  readonly refreshToken: string;
}

export interface TokenPayload {
  readonly sub: string;
  readonly role: string;
}

export interface TokenSignerPort {
  sign(payload: TokenPayload): Promise<AuthTokens>;
}