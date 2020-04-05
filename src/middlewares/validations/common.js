import Joi from '@hapi/joi';

import { commonJoi } from '../../helper/joiSchema';
import { constants } from '../../constants';

let responseObj = {};

class Common {
  skipLimit = (req, res, next) => {
    let result = Joi.validate(req.query, commonJoi.QueryScheme());
    if (result.error) {
      let error = result.error.details.map(item => {
        return { message: item.message, path: item.path };
      });
      responseObj.status = 400;
      responseObj.message = constants.controllerStatus.BAD_REQUEST;
      responseObj.error = error;
      res.status(400).json(responseObj);
    } else {
      // console.log(req.query.skip, req.query.limit);
      for (let key in req.query) {
        req.query[key] = req.sanitize(req.query[key]);
      }

      next();
    }
  };
  pathParams = (req, res, next) => {
    let result = Joi.validate(req.params, commonJoi.ParamSachema());
    if (result.error) {
      let error = result.error.details.map(item => {
        return { message: item.message, path: item.path };
      });
      responseObj.status = 400;
      responseObj.message = constants.controllerStatus.BAD_REQUEST;
      responseObj.error = error;
      res.status(400).json(responseObj);
    } else {
      req.params.id = req.sanitize(req.params.id);
      next();
    }
  };
}

export const common = new Common();
export default common;
