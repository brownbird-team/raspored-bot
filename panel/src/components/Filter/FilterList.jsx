import React from "react";
import { MdDelete } from "react-icons/md";
import { BiEdit } from "react-icons/bi";

const FilterList = ({ filter, onDelete, onEdit }) => {
    const { filterName } = filter;

    return (
        <div className="filter-list-parent">
            <button onClick={onDelete} className="filter-item use-hover">
                <MdDelete size={25} />
            </button>
            <span className="filter-list-label">{filterName}</span>
            <button onClick={onEdit} className="filter-item use-hover">
                <BiEdit size={25} />
            </button>
        </div>
    );
};

export default FilterList;
