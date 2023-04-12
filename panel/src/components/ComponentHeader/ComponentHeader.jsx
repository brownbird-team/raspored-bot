import React from "react";
import "./ComponentHeader.css";

const ComponentHeader = ({ children, className = "" }) => {
    return <div className={`component-header ${className}`}>{children}</div>;
};

export default ComponentHeader;
