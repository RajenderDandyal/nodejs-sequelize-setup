import Joi from '@hapi/joi';

import { signUpJoi } from '../../helper/joiSchema';
import { constants } from '../../constants';

let responseObj = {};

class SignUp {
  createUserValidation = (req, res, next) => {
    let result = Joi.validate(req.body, signUpJoi.UserSchema());
    if (result.error) {
      let error = result.error.details.map(item => {
        return { message: item.message, path: item.path };
      });
      responseObj.status = 400;
      responseObj.message = constants.controllerStatus.BAD_REQUEST;
      responseObj.error = error;
      res.status(400).json(responseObj);
    } else {
      for (let key in req.body) {
        req.body[key] = req.sanitize(req.body[key]);
      }
      next();
    }
  };
}

export let signUp = new SignUp();
export default signUp;
