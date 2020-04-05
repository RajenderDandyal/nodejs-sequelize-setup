import {constants} from '../constants';

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:12345',
  'http://myFrontEndApi.com',
  'http://estee-front-end.s3-website.ap-south-1.amazonaws.com'
];

class HelperMethods {
  corsConfig = (origin, callback) => {
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      let msg =
          'The CORS policy for this site does not ' +
          'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  };
  catchErrorController = (err, req, res) => {
    if (err.status) {
      return res.status(err.status).json(err); // error from db class
    }
    return res.status(400).send({
      status: 400,
      message: constants.controllerStatus.BAD_REQUEST,
      error: [{message: err.message}],
    }); // other error in controller
  };
}

export let helperMethods = new HelperMethods();
export default helperMethods;
