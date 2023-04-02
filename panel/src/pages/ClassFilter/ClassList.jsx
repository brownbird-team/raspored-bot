import React from "react";
import { MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import { removeClassFilter } from "../../features/classFilter";

const ClassList = ({ filter, onClick }) => {
    const dispatch = useDispatch();
    const { filterName } = filter;

    return (
        <div className="filter-list-parent">
            <button onClick={() => dispatch(removeClassFilter(filterName))}>
                <span className="badge text-bg-danger">
                    <MdDelete color="white" size={25} />
                </span>
            </button>
            <span className="filter-list-label">{filterName}</span>
            <button onClick={onClick}>
                <span className="badge text-bg-warning">Edit</span>
            </button>
        </div>
    );
};

export default ClassList;
