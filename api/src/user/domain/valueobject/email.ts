import { InvalidEmailException } from '../exception/invalid-email.exception';
export class Email {

  private constructor(readonly value: string) {}

  private static readonly PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  static of(raw: string): Email {
    const normalized = raw.trim().toLowerCase();

    if (!Email.PATTERN.test(normalized)) {
      throw new InvalidEmailException(raw);
    }

    return new Email(normalized);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}