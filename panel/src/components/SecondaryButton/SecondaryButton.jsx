import React from "react";
import "./SecondaryButton.css";

const SecondaryButton = ({ children, onClick, type = "button" }) => {
    return (
        <button type={type} onClick={onClick} className="secondary-button">
            {children}
        </button>
    );
};

export default SecondaryButton;
