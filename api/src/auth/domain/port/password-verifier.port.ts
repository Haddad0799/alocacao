export const PASSWORD_VERIFIER = Symbol('PASSWORD_VERIFIER');

export interface PasswordVerifierPort {
  compare(plain: string, hash: string): Promise<boolean>;
}
