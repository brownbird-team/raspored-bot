import statusCodes from "../data/filter.json";

export const validateFilter = (filter, storedFilters, isExistFilter = false) => {
    // Provjerava duljinu naziva filtera
    if (!filter.filterName.length) return statusCodes.EMPTY_FILTERNAME;

    if (filter.classes) {
        // Provjerava je li postoje definirani razredi
        if (!filter.classes.length) return statusCodes.EMPTY_CLASSES;
    }

    if (filter.periods) {
        // Provjerava je li postoje definirani periodi
        if (!filter.periods.length) return statusCodes.EMPTY_PERIODS;
    }

    if (isExistFilter) {
        // Provjerava postoji li više od jednog filtera sa istim uniqueId-om
        if (storedFilters.find(({ uniqueId }) => filter.uniqueId === uniqueId) > 1) return statusCodes.EXIST_FILTERNAME;
    } else {
        // Provjerava postoji li više filtera sa istim nazivom
        if (storedFilters.find(({ filterName }) => filter.filterName === filterName))
            return statusCodes.EXIST_FILTERNAME;
    }

    if (isExistFilter) return statusCodes.FILTER_CHANGED;
    else return statusCodes.FILTER_CREATED;
};
