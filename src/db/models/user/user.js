'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.INTEGER,
      authToken: {
        type: DataTypes.INTEGER,
      },
    },
    {},
  );
  User.associate = function() {
    // associations can be defined here
  };
  return User;
};
