class UpdateUser {
  validateUser = (req, res, next) => {
    for (let key in req.body) {
      req.body[key] = req.sanitize(req.body[key]);
    }
    next();
  };
}

export const updateUser = new UpdateUser();
export default updateUser;
