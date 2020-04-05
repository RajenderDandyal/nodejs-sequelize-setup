import Joi from '@hapi/joi';
import { signInJoi } from '../../helper/joiSchema';
import { constants } from '../../constants';

let responseObj = {};

class SignIn {
  signInUserValidation = (req, res, next) => {
    let result = Joi.validate(req.body, signInJoi.UserSchema());
    if (result.error) {
      let error = result.error.details.map(item => {
        return { message: item.message, path: item.path };
      });
      responseObj.status = 400;
      responseObj.message = constants.controllerStatus.BAD_REQUEST;
      responseObj.error = error;
      res.status(400).json(responseObj);
    } else {
      req.body.email = req.sanitize(req.body.email);
      req.body.password = req.sanitize(req.body.password);
      next();
    }
  };
}

export const signIn = new SignIn();
export default signIn;
