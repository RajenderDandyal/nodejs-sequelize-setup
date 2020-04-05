import { jwtToken } from '../helper';

class Auth {
  userAuth = (req, res, next) => {
    return jwtToken.validateToken(req, res, next);
  };
  adminAuth = (req, res, next) => {
    // modify the jwtToken.validateToken(req, res, next, admin)
    // if admin is true then check for role=1
    next();
  };
}
export const auth = new Auth();
export default auth;
