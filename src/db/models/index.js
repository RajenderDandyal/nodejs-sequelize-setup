'use strict';

// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(
//     process.env[config.use_env_variable],
//     config,
//   );
// } else {
//   sequelize = new Sequelize(
//     config.database,
//     config.username,
//     config.password,
//     config,
//   );
// }

// fs.readdirSync(__dirname)
//   .filter(file => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.slice(-3) === '.js'
//     );
//   })
//   .forEach(file => {
//     const model = sequelize['import'](path.join(__dirname, file));
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });
// console.log(db.User);
// db.sequelize = sequelize;
// db.Sequelize = Sequelize;
// db.sequelize.sync({ force: true });
// module.exports = db;
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
//import { getConfig } from "../../lib/config";
const db = {};
// Load config file based on the enviroment

let sequelize = null;
const { Op } = Sequelize;
const operatorsAliases = {
  $gt: Op.gt,
  $gte: Op.gte,
  $ne: Op.ne,
  $in: Op.in,
  $or: Op.or,
  $and: Op.and,
  $like: Op.like,
};

const databaseConf = config;
sequelize = new Sequelize(
  databaseConf.database,
  databaseConf.username,
  databaseConf.password,
  {
    host: databaseConf.host,
    dialect: databaseConf.dialect,
    operatorsAliases,
  },
);

const files = [];
const sortDir = maniDir => {
  const folders = [];
  const CheckFile = filePath => fs.statSync(filePath).isFile();
  const sortPath = dir => {
    fs.readdirSync(dir)
      .filter(file => file.indexOf('.') !== 0 && file !== 'index.js')
      .forEach(res => {
        const filePath = path.join(dir, res);
        if (filePath.indexOf('Schema') === -1) {
          if (CheckFile(filePath)) {
            files.push(filePath);
          } else {
            folders.push(filePath);
          }
        }
      });
  };
  folders.push(maniDir);
  let i = 0;
  do {
    sortPath(folders[i]);
    i += 1;
  } while (i < folders.length);
};
sortDir(__dirname);

files.forEach(file => {
  const model = sequelize.import(file);
  db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
  //console.log(modelName);
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.sequelize.sync({
  logging: false,
  force: true,
});
//console.log('user', db.User);
export default db;
