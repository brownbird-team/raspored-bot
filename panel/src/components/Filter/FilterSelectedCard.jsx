import React from "react";

const FilterSelectedCard = ({ children }) => {
    return (
        <div>
            <div className="filter-item use-hover">{children}</div>
        </div>
    );
};

export default FilterSelectedCard;
