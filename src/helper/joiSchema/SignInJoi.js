import Joi from '@hapi/joi';

class SignInJoi {
  UserSchema() {
    return Joi.object().keys({
      email: Joi.string()
        .email()
        .min(8)
        .max(30)
        .required(),
      password: Joi.string()
        .min(6)
        .max(40)
        .required(),
    });
  }
}

export let signInJoi = new SignInJoi();
export default signInJoi;
