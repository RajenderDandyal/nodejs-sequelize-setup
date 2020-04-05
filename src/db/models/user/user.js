'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.BIGINT,
      password: DataTypes.STRING,
      authToken: {
        type: DataTypes.STRING,
      },
    },
    {},
  );
  User.associate = function() {
    // associations can be defined here
  };
  return User;
};
