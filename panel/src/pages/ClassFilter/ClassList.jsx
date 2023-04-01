import React, { useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const ClassList = ({ filter }) => {
    const [open, setOpen] = useState(false);

    const { filterName, values } = filter;

    return (
        <>
            <button className="filter-list-item" onClick={() => setOpen(!open)}>
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
