import Joi from '@hapi/joi';

class CommonJoi {
  QueryScheme = () => {
    return Joi.object()
      .keys({
        skip: Joi.string().optional(),
        limit: Joi.string().optional(),
      })
      .and('skip', 'limit');
  };
  ParamSachema = () => {
    return Joi.object().keys({
      id: Joi.string().required(),
    });
  };
}
export const commonJoi = new CommonJoi();
export default commonJoi;
