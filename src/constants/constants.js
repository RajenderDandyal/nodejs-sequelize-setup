import ControllerConstants from './controllerConstants';
import isEmpty from 'lodash/isEmpty';

class Constants extends ControllerConstants {
  constructor() {
    super();
    // used inside db class ..catch case
    this.responseObjErrorDb = (err, message) => {
      return {
        status: 500,
        message: `Internal server error: ${message}`,
        error: [{ message: err }],
      };
    };
    // used inside db class ..try for bad request case
    this.responseObjError = (err, message) => {
      return {
        status: 400,
        message,
        error: [{ message: err }],
      };
    };
    // used inside db class .try success case
    this.responseObjSuccess = (doc, message) => {
      return {
        status: 200,
        message,
        body: !Array.isArray(doc) && !isEmpty(doc) ? [doc] : doc,
        //body:doc,
      };
    };
  }
}

export let constants = new Constants();
export default constants;
