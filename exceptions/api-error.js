module.exports = class ApiError extends Error {
  status;
  errors;

  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static BadRequests(message, errors = []) {
    return new ApiError(400, message, errors);
  }
  static UnathorizedUser() {
    return new ApiError(401, "Користувач не авторизований");
  }
};
