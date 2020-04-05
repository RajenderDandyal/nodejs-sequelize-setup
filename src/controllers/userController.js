import isEmpty from 'lodash/isEmpty';

import db from '../db/models';
import { dbCrud } from '../helper/dbCrud/index';
import { helperMethods, jwtToken, bcryptPassword } from '../helper';

class UserController {
  test = (req, res) => {
    if (isEmpty(req.body)) {
      return res.status(200).json({ success: true, body: {} });
    }
    return res.status(200).json({ success: true, body: req.body });
  };

  signUpUser = async (req, res) => {
    // try {
    //   let response = await dbCrud.insertData(db.User, req.body);
    //   if (response) {
    //     return res.json(response);
    //   }
    // } catch (err) {
    //   console.log(
    //     'Something went wrong: Controller: signUp user',
    //     err,
    //   );
    //   return helperMethods.catchErrorController(err, req, res);
    // }

    let responseObj = {};
    try {
      let userWithSameEmail = await dbCrud.findAndCountAll(db.User, {
        where: { email: req.body.email },
      });
      console.log(userWithSameEmail);
      if (!isEmpty(userWithSameEmail.body[0]['rows'])) {
        responseObj.status = 400;
        responseObj.message = 'User already exists';
        responseObj.error = [{ message: 'email should be unique' }];
        return res.status(400).send(responseObj);
      }
      let data = req.body;
      data.password = await bcryptPassword.bcryptHash(data.password);
      //console.log("req.body**", data);
      if (data.password) {
        responseObj = await dbCrud.insertData(db.User, data);
        return res.status(responseObj.status).send(responseObj);
      } else {
        // console.log("bcrypt error")
        responseObj.status = 500;
        responseObj.message = 'password could not be hashed';
        responseObj.error = [
          { message: 'password could not be hashed' },
        ];
        return res.status(500).json(responseObj);
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
      let userFromDb = await db.User.findAndCountAll({
        email: data.email,
      });
      console.log(userFromDb);
      if (
        !isEmpty(userFromDb[0]['rows']) &&
        userFromDb.length === 1 &&
        Array.isArray(userFromDb[0]['rows'])
      ) {
        let isMatch = await bcryptPassword.comparePasswords(
          data.password,
          userFromDb[0]['rows'][0].password,
        );
        console.log('isMatch', isMatch);
        if (isMatch) {
          let bearerToken = await jwtToken.generateBearerToken(
            userFromDb[0]['rows'][0].id,
          );
          // only one auth token is allowed
          // so remove previous one and add new one

          userFromDb[0]['rows'][0].authToken = bearerToken;
          await userFromDb[0]['rows'][0].save();
          //console.log(bearerToken);
          responseObj = {
            status: 200,
            message: 'Success',
            body: [tokenObj],
          };
          return res.status(responseObj.status).send(responseObj);
        } else {
          // console.log("bcrypt error")
          responseObj.status = 500;
          responseObj.message = 'Password invalid';
          responseObj.error = [{ message: 'Passward is invalid' }];
          return res.status(500).json(responseObj);
        }
      } else {
        // console.log("bcrypt error")
        responseObj.status = 400;
        responseObj.message = 'User not found';
        responseObj.error = [{ message: 'User not found' }];
        return res.status(400).json(responseObj);
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
    // try {
    //   let responseObj = {};
    //   let user = req.user;
    //   user.token = user.token.filter(
    //     item => item.tokenFor !== 'authentication',
    //   );
    //   await user.save();
    //   //let user = User.findById(req.user._id);
    //   //console.log(user);
    //   responseObj.status = 200;
    //   responseObj.message = 'User logged out';
    //   responseObj.body = [];
    //   return res.json(responseObj);
    // } catch (e) {
    //   console.log(
    //     'Something went wrong: Controller: signOut user',
    //     e,
    //   );
    //   return helperMethods.catchErrorController(e, req, res);
    // }
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
    //   responseObj = await dbCrud.find(User, data);
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
    //   responseObj = await dbCrud.deleteOne(User, data);
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
