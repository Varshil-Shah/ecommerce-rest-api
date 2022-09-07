const {
  queryFiltering,
  advanceQueryFiltering,
  convertNumericStringToNumber,
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

  copyOfFilterQuery = convertNumericStringToNumber(copyOfFilterQuery);

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

// Project selected fields
const projectData = (projectQuery) => {
  const projectObject = {};

  if (projectQuery.fields) {
    const projectFields = projectQuery.fields.split(',');
    projectFields.forEach((field) => {
      projectObject[field.trim()] = 1;
    });
  }

  return projectObject;
};

// Pagination
const pagination = (paginationQuery) => {
  const page = Math.abs(paginationQuery.page * 1) || 1;
  const limit = paginationQuery.limit * 1 || 15;
  const skip = (page - 1) * limit;

  return [limit, skip];
};

const APIFeaturesAggregation = (query, model, mapOfFilters) => {
  const filteredValue = filterData(query, mapOfFilters);
  const sortedValue = sortData(query);
  const projectValues = projectData(query);
  const [limit, skip] = pagination(query);

  const listOfAggregates = [
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $match: filteredValue,
    },
    {
      $sort: sortedValue,
    },
  ];

  // If projectValues object contains some object, then push it to listOfAggregates
  if (Object.keys(projectValues).length)
    listOfAggregates.push({ $project: projectValues });

  return model.aggregate(listOfAggregates);
};

module.exports = APIFeaturesAggregation;
