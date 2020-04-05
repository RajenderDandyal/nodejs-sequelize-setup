import Joi from '@hapi/joi';

class SignUpJoi {
  UserSchema() {
    return Joi.object().keys({
      name: Joi.string()
        .min(6)
        .max(30)
        .required(),
      email: Joi.string()
        .email()
        .min(8)
        .max(30)
        .required(),
      phone: Joi.number().required(),
      password: Joi.string()
        .min(6)
        .max(40)
        .required(),
      confirmPassword: Joi.any()
        .valid(Joi.ref('password'))
        .required()
        .options({
          language: { any: { allowOnly: 'must match password' } },
        }),
    });
  }
}

export let signUpJoi = new SignUpJoi();
export default signUpJoi;
