import React from "react";
import "./MainLayout.css";
import PageHeader from "../components/PageNavbar";

const MainLayout = ({ children, pageItems }) => {
    return (
        <div className="main-layout">
            <PageHeader items={pageItems} />
            {children}
        </div>
    );
};

export default MainLayout;
