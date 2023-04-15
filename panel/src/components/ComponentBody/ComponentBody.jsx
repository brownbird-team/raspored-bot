import React from "react";
import "./ComponentBody.css";

const ComponentBody = ({ children, className = "" }) => {
    return <div className={`component-body ${className}`}>{children}</div>;
};

export default ComponentBody;
