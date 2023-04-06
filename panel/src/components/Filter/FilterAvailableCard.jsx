import React from "react";

const FilterAvailableCard = ({ children, className, onClick }) => {
    return (
        <button className={className} onClick={() => onClick()}>
            {children}
        </button>
    );
};

export default FilterAvailableCard;
