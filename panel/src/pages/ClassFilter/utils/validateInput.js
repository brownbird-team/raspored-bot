export const validateNewFilter = (newFilter, storedFilters) => {
    // Provjeri duljinu naziva filtera
    if (!newFilter.filterName.length) return false;
    // Provjeri broj definiranih razreda za filter
    if (!newFilter.classes.length) return false;
    // Provjeri postoji li više filtera sa istim trenutnim nazivom
    if (storedFilters.find(({ filterName }) => newFilter.filterName === filterName)) return false;

    return true;
};

export const validateExistFilter = (existFilter, storedFilters) => {
    // Provjeri duljinu naziva filtera
    if (!existFilter.filterName.length) return false;
    // Provjeri broj definiranih razreda za filter
    if (!existFilter.classes.length) return false;
    // Provjeri postoji li više od jednog filtera sa istim uniqueId-om
    if (storedFilters.find(({ uniqueId }) => existFilter.uniqueId === uniqueId) > 1) return false;

    return true;
};
