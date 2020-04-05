import isEmpty from 'lodash/isEmpty';

import { constants } from '../../constants/index';

class DbCrud {
  insertData = (Model, data, options) => {
    return new Promise(async (resolve, reject) => {
      try {
        let doc = await Model.create(data, options);

        //console.log("insertDB==========",doc)
        if (doc) {
          return resolve(doc);
        } else {
          return reject(
            constants.responseObjError(
              doc,
              constants.dataBaseStatus.ENTITY_ERROR,
            ),
          );
        }
      } catch (e) {
        console.log('Something went wrong inside: db insertData', e);
        return reject(
          constants.responseObjErrorDb(
            e,
            constants.dataBaseStatus.ENTITY_ERROR,
          ),
        );
      }
    });
  };
  findAndCountAll = (model, options) => {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = await model.findAndCountAll(options);
        return resolve(doc);
      } catch (e) {
        console.log('Something went wrong inside: db find', e);
        return reject(
          constants.responseObjErrorDb(
            e,
            constants.dataBaseStatus.DATA_FETCH_ERROR,
          ),
        );
      }
    });
  };

  findAll = (model, options) => {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = await model.findAll(options);
        return resolve(doc);
      } catch (e) {
        console.log('Something went wrong inside: db find', e);
        return reject(
          constants.responseObjErrorDb(
            e,
            constants.dataBaseStatus.DATA_FETCH_ERROR,
          ),
        );
      }
    });
  };
  update = (model, data, options) => {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = await model.update(data, options);
        return resolve(doc);
      } catch (e) {
        console.log('Something went wrong inside: db updateOne', e);
        reject(
          constants.responseObjErrorDb(
            e,
            constants.dataBaseStatus.DATA_FETCH_ERROR,
          ),
        );
      }
    });
  };
  delete = (model, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = await model.findByIdAndRemove(data.query);

        return resolve(doc);
      } catch (e) {
        console.log('Something went wrong inside: db insertData', e);
        return reject(
          constants.responseObjErrorDb(
            e,
            constants.dataBaseStatus.DATA_FETCH_ERROR,
          ),
        );
      }
    });
  };
}

export let dbCrud = new DbCrud();
export default dbCrud;
