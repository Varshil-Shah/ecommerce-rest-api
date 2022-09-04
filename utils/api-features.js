const {
  queryFiltering,
  advanceQueryFiltering,
} = require('../helper/api-function');

// Filter Object
const filterObject = (filterQuery, mapOfFilters) => {
  let copyOfFilterQuery = { ...filterQuery };

  // fields which shoulld be execluded from filterObject
  const excludedFields = ['page', 'sort', 'fields', 'limit'];

  // remove all execluded fields from filterObject
  excludedFields.forEach((field) => {
    delete copyOfFilterQuery[field];
  });

  copyOfFilterQuery = advanceQueryFiltering(JSON.stringify(copyOfFilterQuery));

  copyOfFilterQuery = queryFiltering(mapOfFilters, copyOfFilterQuery);

  return copyOfFilterQuery;
};

const APIFeaturesAggregation = (query, model, mapOfFilters) => {
  const filteredObjects = filterObject(query, mapOfFilters);
  const listOfAggregates = [
    {
      $match: filteredObjects,
    },
  ];

  return model.aggregate(listOfAggregates);
};

module.exports = APIFeaturesAggregation;
