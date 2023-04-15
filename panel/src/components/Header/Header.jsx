import React from "react";
import "./Header.css";

const Header = ({ children, className = "" }) => {
    return <div className={`component-header ${className}`}>{children}</div>;
};

export default Header;
