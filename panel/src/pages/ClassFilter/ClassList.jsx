import React, { useState } from "react";
import { MdOutlineKeyboardArrowDown, MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import { removeClassFilter } from "../../features/classFilter";

const ClassList = ({ filter }) => {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const { filterName, values } = filter;

    return (
        <>
            <button className="filter-list-item" onClick={() => setOpen(!open)}>
                <div className="filter-list-actions">
                    <MdDelete color="red" size={25} onClick={() => dispatch(removeClassFilter(filterName))} />
                </div>
                <span>{filterName}</span>
                {open ? (
                    <MdOutlineKeyboardArrowDown size={25} className="filter-icon arrow up" />
                ) : (
                    <MdOutlineKeyboardArrowDown size={25} className="filter-icon arrow down" />
                )}
            </button>
            {open
                ? values.map(({ id, label }) => (
                      <div key={id} className="filter-item use-hover">
                          {label}
                      </div>
                  ))
                : null}
        </>
    );
};

export default ClassList;
