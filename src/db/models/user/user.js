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
        defaultValue: null,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: 0,
      }, // 0 user,1 admin
    },
    {},
  );
  User.associate = function() {
    // associations can be defined here
  };
  return User;
};
