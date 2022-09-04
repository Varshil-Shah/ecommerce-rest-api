const {
  queryFiltering,
  advanceQueryFiltering,
} = require('../helper/api-function');

// Filter data
const filterData = (queryObject, mapOfFilters) => {
  let copyOfFilterQuery = { ...queryObject };

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

// Sort data
const sortData = (sortQuery) => {
  const sortedObject = {};

  // check if sort query is present or not
  if (sortQuery.sort) {
    const sortQueryValues = sortQuery.sort.split(',');
    sortQueryValues.forEach((element) => {
      if (element.startsWith('-')) {
        const value = element.split('-')[1];
        sortedObject[value] = -1;
      } else {
        sortedObject[element] = 1;
      }
    });
  } else {
    sortedObject.createdAt = -1;
  }

  return sortedObject;
};

const APIFeaturesAggregation = (query, model, mapOfFilters) => {
  const filteredValue = filterData(query, mapOfFilters);
  const sortedValue = sortData(query);

  const listOfAggregates = [
    {
      $match: filteredValue,
    },
    {
      $sort: sortedValue,
    },
  ];

  return model.aggregate(listOfAggregates);
};

module.exports = APIFeaturesAggregation;
