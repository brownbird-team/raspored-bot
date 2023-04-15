import React from "react";
import "./ComponentFooter.css";

const ComponentFooter = ({ children, className = "" }) => {
    return <div className={`component-footer ${className}`}>{children}</div>;
};

export default ComponentFooter;
