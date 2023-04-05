import React from "react";
import "./PeriodFilter.css";
import MainLayout from "../../layouts/MainLayout";

// Definiraj Page Items za Header
const pageItems = ["Filteri perioda"];

const PeriodFilter = () => {
    return (
        <MainLayout pageItems={pageItems}>
            <div className="filter-main">
                <div className="filter-header">
                    <span>Filteri perioda</span>
                </div>
            </div>
        </MainLayout>
    );
};

export default PeriodFilter;
