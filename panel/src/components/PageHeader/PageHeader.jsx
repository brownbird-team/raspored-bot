import React from "react";
import "./PageHeader.css";

const PageHeader = ({ items }) => {
    return (
        <div className="page-header">
            {items.map((item) => (
                <div>
                    <span>{item}</span>
                </div>
            ))}
        </div>
    );
};

export default PageHeader;
