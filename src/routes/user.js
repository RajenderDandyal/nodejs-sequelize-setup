import express from 'express';

import { userController } from '../controllers';
import {
  common,
  signUp,
  signIn,
  auth,
  updateUser,
} from '../middlewares';

let router = express.Router();

/*
 * path /api/v1/user/test
 * get
 * public
 * testing user route
 * */
router.get('/test', userController.test);

/*
 * path /api/v1/user/test
 * post
 * public
 * testing user route
 * */
router.post('/test', userController.test);
/*
 * path /api/v1/user/sign_in
 * post
 * public
 * register new user
 * */
router.post(
  '/sign_in',
  signIn.signInUserValidation,
  userController.signInUser,
);
/*
 * path /api/v1/user/sign_out
 * post
 * private
 * user sign out
 * */
router.get(
  '/sign_out/:id',
  common.pathParams,
  auth.userAuth,
  userController.signOutUser,
);
/*
 * path /api/v1/user/sign_up
 * post
 * public
 * user sign up
 * */
router.post(
  '/sign_up',
  signUp.createUserValidation,
  userController.signUpUser,
);
/*
 * path /api/v1/user/list
 * get
 * public
 * list all users or pagination
 * */
router.get('/list', common.skipLimit, userController.list);
/*
 * path /api/v1/user/details/:id
 * get
 * protected
 * get user details by its id
 * */
router.get(
  '/detail/:id',
  auth.userAuth,
  common.pathParams,
  userController.details,
);
/*
 * path /api/v1/user/update/:id
 * put
 * protected
 * update user by its id
 * */
router.put(
  '/update/:id',
  auth.userAuth,
  common.pathParams,
  updateUser.validateUser,
  userController.update,
);
/*
 * path /api/v1/user/register
 * delete
 * protected
 * delete user by its id
 * */
router.delete(
  '/delete/:id',
  auth.userAuth,
  common.pathParams,
  userController.deleteOne,
);
/*
 * path /api/v1/user/auth/:id
 * auth
 * public
 * get auth token
 * */
router.get('/auth/:id', userController.auth);

export default router;
