const mongoose = require('mongoose');

/**
 * Helps for advance filtering like to convert greater than (gt->$gt), greater than or equal to (gte->$gte), less than (lt->$lte), less than or equal to (lte->$lte) and equal to (eq->$eq).
 * @param {String} value
 * @returns {Object}
 */
exports.advanceQueryFiltering = (value) =>
  JSON.parse(value.replace(/\b(gte|gt|lte|lt|eq)\b/g, (match) => `$${match}`));

/**
 * Filtering objects in required way
 * @param {Map<String, String>} map
 * @param {Object} query
 * @returns {Object}
 */
exports.queryFiltering = (map, query) => {
  Object.entries(query).forEach(([key, value]) => {
    if (map.has(key)) {
      if (key.toLowerCase().includes('id')) {
        query[map.get(key)] = mongoose.Types.ObjectId(value);
      } else {
        query[map.get(key)] = value;
      }
    }
    delete query[key];
  });

  return query;
};
