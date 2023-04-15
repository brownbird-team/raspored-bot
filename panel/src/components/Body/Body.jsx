import React from "react";
import "./Body.css";

const Body = ({ children, className = "" }) => {
    return <div className={`component-body ${className}`}>{children}</div>;
};

export default Body;
