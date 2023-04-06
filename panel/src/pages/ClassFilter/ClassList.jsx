import React from "react";
import { MdDelete } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { removeClassFilter } from "../../features/classFilter";

const ClassList = ({ filter, onClick }) => {
    const dispatch = useDispatch();
    const { filterName } = filter;

    return (
        <div className="filter-list-parent">
            <button onClick={() => dispatch(removeClassFilter(filterName))} className="filter-item use-hover">
                <MdDelete size={25} />
            </button>
            <span className="filter-list-label">{filterName}</span>
            <button onClick={onClick} className="filter-item use-hover">
                <BiEdit size={25} />
            </button>
        </div>
    );
};

export default ClassList;
