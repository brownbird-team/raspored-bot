import React from "react";
import "./MainLayout.css";
import PageHeader from "../components/PageHeader";

const MainLayout = ({ children, pageItems, className = "" }) => {
    return (
        <div className="main-layout">
            <PageHeader items={pageItems} />
            <div className={`main-layout-content ${className}`}>
                {children}
            </div>
        </div>
    );
};

export default MainLayout;
