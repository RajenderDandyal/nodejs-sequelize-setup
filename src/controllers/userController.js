import isEmpty from 'lodash/isEmpty';

import db from '../db/models';

import { helperMethods, jwtToken, bcryptPassword } from '../helper';
import { constants } from '../constants';

class UserController {
  test = (req, res) => {
    if (isEmpty(req.body)) {
      return res.status(200).json({ success: true, body: {} });
    }
    return res.status(200).json({ success: true, body: req.body });
  };

  signUpUser = async (req, res) => {
    let responseObj = {};
    try {
      let userWithSameEmail = await db.User.findAll({
        where: { email: req.body.email },
      });
      console.log(userWithSameEmail);
      if (!isEmpty(userWithSameEmail)) {
        responseObj.status = 400;
        responseObj.message = 'User already exists';
        responseObj.error = [{ message: 'email should be unique' }];
        return res.status(400).send(responseObj);
      }
      let data = req.body;
      data.password = await bcryptPassword.bcryptHash(data.password);
      //console.log("req.body**", data);
      if (data.password) {
        let response = await db.User.create(data);

        return res
          .status(200)
          .send(constants.responseObjSuccess(response));
      } else {
        // console.log("bcrypt error")
        return res.status(400).json(constants.responseObjError({}));
      }
    } catch (err) {
      console.log(
        'Something went wrong: Controller: signUp user',
        err,
      );
      return helperMethods.catchErrorController(err, req, res);
    }
  };
  signInUser = async (req, res) => {
    let responseObj = {};
    try {
      let data = req.body;
      let response = await db.User.findAll({
        where: { email: req.body.email },
      });
      let user = response[0];
      // userFromDb = userFromDb.body
      //   ? userFromDb.body[0].rows[0]
      //   : null;
      //userFromDb = userFromDb.toJson();
      //console.log(userFromDb);
      if (!isEmpty(user)) {
        let isMatch = await bcryptPassword.comparePasswords(
          data.password,
          user.password,
        );
        console.log('isMatch', isMatch);
        if (isMatch) {
          let bearerToken = await jwtToken.generateBearerToken(
            user.id,
          );

          await db.User.update(
            { authToken: bearerToken },
            { where: { id: user.id }, returning: true },
          );
          let updatedRecord = await db.User.findByPk(user.id);
          console.log(updatedRecord);
          return res
            .status(200)
            .send(constants.responseObjSuccess(updatedRecord));
        } else {
          // console.log("bcrypt error")
          return res
            .status(500)
            .json(
              constants.responseObjError(
                {},
                'Password is invalid',
                500,
              ),
            );
        }
      } else {
        // console.log("bcrypt error")
        return res
          .status(400)
          .json(constants.responseObjError({}, 'User not found'));
      }
    } catch (err) {
      console.log(
        'Something went wrong: Controller: signIn user',
        err,
      );
      return helperMethods.catchErrorController(err, req, res);
    }
  };
  signOutUser = async (req, res) => {
    try {
      let user = req.user;
      user.authToken = null;
      await user.save();

      return res.json(
        constants.responseObjSuccess(user, 'User logged out'),
      );
    } catch (e) {
      console.log(
        'Something went wrong: Controller: signOut user',
        e,
      );
      return helperMethods.catchErrorController(e, req, res);
    }
  };

  list = async (req, res) => {
    //console.log(req.query, req.params)
    // let responseObj = {};
    // try {
    //   let data = {
    //     dbQuery: {},
    //     excludeFields: '-role -__v -password',
    //     pagination: isEmpty(req.query)
    //       ? {}
    //       : {
    //           skip: parseInt(req.query.skip),
    //           limit: parseInt(req.query.limit),
    //         },
    //   };
    //   //console.log('req.body**', req.query.skip, req.query.limit);
    //   responseObj = await db.User.find(User, data);
    //   return res.status(responseObj.status).send(responseObj);
    // } catch (err) {
    //   console.log(
    //     'Something went wrong: Controller: list all user',
    //     err,
    //   );
    //   return helperMethods.catchErrorController(err, req, res);
    // }
  };
  details = async (req, res) => {
    // let responseObj = {};
    // try {
    //   let data = {
    //     dbQuery: { _id: mongoose.Types.ObjectId(req.params.id) },
    //     excludeFields: '-role -__v -password',
    //     pagination: {},
    //   };
    //   responseObj = await db.find(User, data);
    //   return res.status(responseObj.status).send(responseObj);
    // } catch (err) {
    //   console.log(
    //     'Something went wrong: Controller: get user details',
    //     err,
    //   );
    //   return helperMethods.catchErrorController(err, req, res);
    // }
  };
  update = async (req, res) => {
    // let responseObj = {};
    // try {
    //   let data = {
    //     query: { _id: mongoose.Types.ObjectId(req.user._id) },
    //     doc: req.body,
    //   };
    //   //console.log(req.user.email, data.doc.email);
    //   //if (req.user.email !== data.doc.email) delete data.doc.email;
    //   responseObj = await db.updateOne(User, data);
    //   return res.status(responseObj.status).send(responseObj);
    // } catch (err) {
    //   console.log(
    //     'Something went wrong: Controller: update user',
    //     err,
    //   );
    //   return helperMethods.catchErrorController(err, req, res);
    // }
  };
  deleteOne = async (req, res) => {
    // let responseObj = {};
    // try {
    //   let data = {
    //     query: { _id: mongoose.Types.ObjectId(req.user.id) },
    //   };
    //   responseObj = await db.User.deleteOne(User, data);
    //   return res.status(responseObj.status).send(responseObj);
    // } catch (err) {
    //   console.log(
    //     'Something went wrong: Controller: delete user',
    //     err,
    //   );
    //   return helperMethods.catchErrorController(err, req, res);
    // }
  };
  auth = async (req, res) => {
    //   let responseObj = {};
    //   try {
    //     let bearerToken = await jwtToken.generateBearerToken(
    //       req.params.id,
    //     );
    //     //console.log(bearerToken);
    //     responseObj = {
    //       status: 200,
    //       message: 'Success',
    //       body: [{ token: bearerToken }],
    //     };
    //     return res.status(responseObj.status).send(responseObj);
    //   } catch (err) {
    //     console.log('Something went wrong: Controller: auth', err);
    //     return helperMethods.catchErrorController(err, req, res);
    //   }
    // };
  };
}

export const userController = new UserController();
export default userController;
