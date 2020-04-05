import DatabaseConstants from './databaseConstants';

class ControllerConstants extends DatabaseConstants {
  constructor() {
    super();
    this.controllerStatus = {
      BAD_REQUEST: 'Bad request from client',
      TOKEN_MISSING: 'Token is missing',
      INVALID_TOKEN: 'Token is invalid',
      USER_AUTHENTICATED: 'User authenticated',
    };
  }
}
export default ControllerConstants;
