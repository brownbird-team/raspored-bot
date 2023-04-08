import React from "react";
import "./PrimaryButton.css";

const PrimaryButton = ({ children, onClick, type = "button" }) => {
    return (
        <button type={type} onClick={onClick} className="primary-button">
            {children}
        </button>
    );
};

export default PrimaryButton;
