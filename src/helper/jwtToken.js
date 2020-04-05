import jwt from 'jsonwebtoken';
import isEmpty from 'lodash/isEmpty';
import mongoose from 'mongoose';

import { constants } from '../constants';
import db from '../db/models';
import { dbCrud } from './dbCrud';
import { keys } from './keys';

let responseObj = {
  status: 400,
  message: constants.controllerStatus.INVALID_TOKEN,
  error: [{ message: 'Auth token is invalid' }],
};

class JwtToken {
  validateToken = (req, res, next) => {
    try {
      let bearerHeader = req.headers['authorization'];
      if (bearerHeader.startsWith('Bearer ')) {
        // Remove Bearer from string
        const tokenFromHeaders = bearerHeader.split(' ')[1].trim();
        if (tokenFromHeaders) {
          jwt.verify(
            tokenFromHeaders,
            keys.JWT_SECRET_KEY,
            async (err, token) => {
              if (err) {
                res.redirect(
                  process.env.NODE_ENV === 'development'
                    ? 'http://localhost:3000/sign_in'
                    : 'http://yourDomain.com/sign_in',
                );
                return res
                  .status(401)
                  .send(
                    constants.responseObjError(
                      {},
                      constants.controllerStatus.INVALID_TOKEN,
                    ),
                  );
              } else {
                /*console.log("====token-====",token) //decoded token
                    console.log("====token id-====",token._id)*/
                let user = await db.User.findAll({
                  where: { id: token.id },
                });
                console.log(user);

                const notExp =
                  token.exp - Math.floor(Date.now() / 1000) > 0;

                const authTokenFromDb = user[0].authToken;

                if (
                  !isEmpty(user) &&
                  notExp &&
                  !isEmpty(authTokenFromDb) &&
                  bearerHeader === authTokenFromDb
                ) {
                  //console.log(user)
                  req.user = user[0];
                  next();
                } else {
                  // res.redirect(
                  //   process.env.NODE_ENV === 'development'
                  //     ? 'http://localhost:3000/sign_in'
                  //     : 'http://yourDomain.com/sign_in',
                  // );
                  return res
                    .status(401)
                    .send(
                      constants.responseObjError(
                        {},
                        constants.controllerStatus.INVALID_TOKEN,
                      ),
                    );
                }
              }
            },
          );
        } else {
          return res
            .status(401)
            .send(
              constants.responseObjError(
                {},
                constants.controllerStatus.INVALID_TOKEN,
              ),
            );
        }
      } else {
        return res.status(401).send(responseObj);
      }
    } catch (e) {
      return res
        .status(400)
        .json(
          constants.responseObjError(
            e,
            constants.controllerStatus.TOKEN_MISSING,
          ),
        );
    }
  };

  generateBearerToken = async id => {
    console.log('keys.JWT_SECRET_KEY', keys.JWT_SECRET_KEY);
    const token = await jwt.sign({ id: id }, keys.JWT_SECRET_KEY, {
      expiresIn: 60 * 60,
    }); // 1hr exp
    console.log(token);
    return `Bearer ${token}`;
  };
}

export const jwtToken = new JwtToken();
export default jwtToken;
