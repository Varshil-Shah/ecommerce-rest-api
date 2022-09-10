// Method to filter out unwanted fields
exports.filterOutUnwantedFields = (object, ...allowedFields) => {
  const newObject = {};
  Object.keys(object).forEach((element) => {
    if (!allowedFields.includes(element)) {
      newObject[element] = object[element];
    }
  });
  return newObject;
};
