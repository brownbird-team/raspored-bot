// prettier-ignore
export const validateFilterName = (name, classes, storedFilters) => {
  const response = {};
  
  return storedFilters.includes(name) || !name.length || !classes.length
    ? false
    : name;
};
