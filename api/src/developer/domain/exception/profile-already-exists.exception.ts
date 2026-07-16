export class ProfileAlreadyExistsException extends Error {
  constructor() {
    super('Developer profile already exists for this user');
    this.name = 'ProfileAlreadyExistsException';
  }
}