import React from "react";
import { IoIosClose } from "react-icons/io";

const ClassSelected = ({ label, onClick }) => {
    return (
        <div>
            <div className="filter-item use-hover">
                <span>{label}</span>
                <IoIosClose className="filter-icon" size={40} color="red" onClick={onClick} />
            </div>
        </div>
    );
};

export default ClassSelected;
