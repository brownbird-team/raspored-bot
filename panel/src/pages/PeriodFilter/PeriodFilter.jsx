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
                    <div className="filter-section-label">
                        <span>Naziv filtera</span>
                    </div>
                    <div className="input-field">
                        <input
                            type="text"
                            placeholder="Naziv filtera"
                            /* value={filterName} */
                            onChange={(e) => void 1}
                        />
                        <button type="button" className="change-btn" onClick={() => void 1}>
                            Kreiraj
                        </button>
                        {/* {action === "edit" ? (
                            <button type="button" className="btn btn-danger" onClick={() => void 1}>
                                Zatvori
                            </button>
                        ) : null} */}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default PeriodFilter;
