export class EmailAlreadyInUseException extends Error {
  constructor(email: string) {
    super(`Email already in use: ${email}`);
  }
}