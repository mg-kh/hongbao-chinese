import { zipObject } from 'lodash';
const selectFromResponse = (fields = ['']) => {
  return zipObject(fields, Array(fields.length).fill(true));
};

export default selectFromResponse;
