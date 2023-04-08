import React from "react";
import "./ComponentHeader.css";

const ComponentHeader = ({ children }) => {
    return <div className="component-header">{children}</div>;
};

export default ComponentHeader;
