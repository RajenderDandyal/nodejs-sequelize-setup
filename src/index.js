//import "core-js";
import 'regenerator-runtime/runtime';

import express from 'express';
import compression from 'compression';
import cors from 'cors';
import expressSanitizer from 'express-sanitizer';
import helmet from 'helmet';
// import swaggerUi from 'swagger-ui-express';
// import jsYaml from 'js-yaml';
// import fs from 'fs';
import path from 'path';
require('dotenv').config({
  path:
    process.env.NODE_ENV === 'production'
      ? path.resolve(__dirname, '../.env.prod')
      : path.resolve(__dirname, '../.env.dev'),
});
// eslint-disable-next-line import/named
import { helperMethods as helper } from './helper';
import { user } from './routes';

const app = express();

// inbound data sanitizer
app.use(expressSanitizer());
// for nginx reverse proxy X-forwarded-
app.set('trust proxy');
// json n url parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// compress the response
app.use(compression());
// cors setup
app.use(cors({ origin: helper.corsConfig }));
// protection helmet
app.use(helmet());
// load json from swagger.yaml
// let swaggerDocument;
// try {
//   swaggerDocument = jsYaml.safeLoad(
//     fs.readFileSync(
//       path.join(__dirname, '../swagger/swagger.yaml'),
//       'utf8',
//     ),
//   );
//   console.log(swaggerDocument);
// } catch (e) {
//   // eslint-disable-next-line
//   console.log(e);
// }
// // routes
// app.use(
//   '/api-docs',
//   swaggerUi.serve,
//   swaggerUi.setup(swaggerDocument),
// );
app.use('/api/v1/user', user);

// error handling

// route not found
app.use((req, res) => {
  let responseObj = {
    status: 404,
    message: 'Invalid route',
    error: { error: true, message: 'route not found', status: 404 },
  };
  res.status(404).json(responseObj);
  //next(error);
});
// log errors to console
app.use(logErrors);
//
app.use(clientErrorHandler);
app.use((error, req, res) => {
  res.status(error.status || 500);
  return res.json({
    status: error.status || 500,
    message: error.message,
    error: {
      error: error.message,
    },
  });
});

// log errors to console
function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}
// error handling for xhr request
function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    //console.log('xhr request');
    res.status(400).send({
      status: 400,
      message: 'Bad request from client',
      error: err.message,
    });
  } else {
    next(err);
  }
}
console.log(process.env.DATABASE);
let port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
