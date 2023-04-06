import React from "react";

const FilterItemSelected = ({ children }) => {
    return (
        <div>
            <div className="filter-item use-hover">{children}</div>
        </div>
    );
};

export default FilterItemSelected;
