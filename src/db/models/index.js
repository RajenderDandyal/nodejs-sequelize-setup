'use strict';

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

const db = {};

let sequelize = null;

const databaseConf = config;
sequelize = new Sequelize(
  databaseConf.database,
  databaseConf.username,
  databaseConf.password,
  {
    host: databaseConf.host,
    dialect: databaseConf.dialect,
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
  //force: true,
});
//console.log('user', db.User);
export default db;
