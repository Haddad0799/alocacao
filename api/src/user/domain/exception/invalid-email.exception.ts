export class InvalidEmailException extends Error {
  constructor(raw: string) {
    super(`Invalid email format: ${raw}`);
  }
}