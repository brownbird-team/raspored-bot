import React from "react";
import "./Footer.css";

const Footer = ({ children, className = "" }) => {
    return <div className={`component-footer ${className}`}>{children}</div>;
};

export default Footer;
