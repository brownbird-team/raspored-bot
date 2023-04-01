// prettier-ignore
export const validateFilterName = (newFilter, storedFilters) => {
  if (!newFilter.filterName.length) {
    return false;
  }

  if (!newFilter.values.length) {
    return false;
  }


  if (storedFilters.find(({filterName}) => newFilter.filterName === filterName)) {
    return false;
  }

  return true;
};
