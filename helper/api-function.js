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
      delete query[key];
    } else {
      query[key] = value;
    }
  });

  return query;
};

/**
 * Converts all numeric string values to number till 2 level of object scanning
 * @param {Object} obj
 * @returns {Object}
 */
exports.convertNumericStringToNumber = (obj) => {
  const res = {};
  for (const key in obj) {
    // Ignore the conversion of all object Id
    if (key.includes('_id')) {
      res[key] = obj[key];
      continue;
    }
    if (typeof obj[key] === 'object') {
      res[key] = {};
      for (const prop in obj[key]) {
        const parsed = parseInt(obj[key][prop], 10);
        res[key][prop] = Number.isNaN(parsed) ? obj[key][prop] : parsed;
      }
      continue;
    }
    const parsed = parseInt(obj[key], 10);
    res[key] = Number.isNaN(parsed) ? obj[key] : parsed;
  }
  return res;
};
