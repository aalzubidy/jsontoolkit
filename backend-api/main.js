const toJsonSchema = require('to-json-schema');

module.exports = function getJSONSchema(obj) {
  return toJsonSchema(obj);
};
