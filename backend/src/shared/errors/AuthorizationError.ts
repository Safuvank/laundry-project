export class AuthorizationError extends Error {
  statusCode: number;

  constructor(
    message = "You are not authorized to perform this action.",
  ) {
    super(message);

    this.name = "AuthorizationError";
    this.statusCode = 403;

    Object.setPrototypeOf(
      this,
      AuthorizationError.prototype,
    );
  }
}