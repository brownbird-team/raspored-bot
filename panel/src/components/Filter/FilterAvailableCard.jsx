import React from "react";

const FilterAvailableCard = ({ label, className, onClick }) => {
    return (
        <button className={className} onClick={() => onClick()}>
            <span>{label}</span>
        </button>
    );
};

export default FilterAvailableCard;
