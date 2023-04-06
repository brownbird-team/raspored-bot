import React, { useState } from "react";
import "./PeriodFilter.css";
import MainLayout from "../../layouts/MainLayout";
import FilterItemSelected from "../../components/Filter/FilterItemSelected";
import FilterAvailableCard from "../../components/Filter/FilterAvailableCard";
import { useSelector, useDispatch } from "react-redux";
import { addPeriodFilter } from "../../features/periodFilter";
import { formatPeriod } from "./utils/formatPeriod";
import { IoIosClose } from "react-icons/io";

// Definiraj Page Items za Header
const pageItems = ["Filteri perioda"];

const PeriodFilter = () => {
    const dispatch = useDispatch();

    // Dohvati sve periode
    const allPeriods = useSelector((state) => state.periods.value);

    const [availablePeriods, setAvailablePeriods] = useState(allPeriods);
    const [selectedPeriods, setSelectedPeriods] = useState([]);
    const [filterName, setFilterName] = useState("");

    // Handler koji dodaje novi period u listu odabranih perioda
    const handleAddSelectedPeriod = (id) => {
        // Dodaje odabrani period u listu odabranih perioda
        const selectedPeriod = availablePeriods.find((period) => period.id === id);
        setSelectedPeriods([...selectedPeriods, selectedPeriod]);

        // Filtrira nove periode tako da nova lista perioda ne sadrži odabrani period
        const newAvailablePeriods = availablePeriods.filter((period) => period.id !== id);
        setAvailablePeriods(newAvailablePeriods);
    };

    // Handler koji briše odabrani period iz liste odabranih perioda
    const handleRemoveSelectedPeriod = (id) => {
        // Briše odabrani period iz liste odabranih perioda
        const newSelectedPeriods = selectedPeriods.filter((period) => period.id !== id);
        setSelectedPeriods(newSelectedPeriods);

        // Dodaje odabrani period u listu mogućih perioda u sortiranom obliku
        const selectedPeriod = selectedPeriods.find((period) => period.id === id);
        const newAvailablePeriods = [...availablePeriods, selectedPeriod];
        setAvailablePeriods(newAvailablePeriods.sort((a, b) => a.id - b.id));
    };

    // Handler koji dodaje novi filter odabranih perioda
    const handleInsertFilter = () => {
        const newFilter = { filterName: filterName, periods: selectedPeriods };
        dispatch(addPeriodFilter(newFilter));
        resetStates();
    };

    // Funkcija koja resetira sve stateove na početne vrijednosti
    const resetStates = () => {
        setAvailablePeriods(allPeriods);
        setSelectedPeriods([]);
        setFilterName("");
    };

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
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                        />
                        <div className="input-buttons">
                            {/* {action === "edit" ? (
                                <button type="button" className="cancel-btn" onClick={() => resetToDefault()}>
                                    Zatvori
                                </button>
                            ) : null} */}
                            <button type="button" className="change-btn" onClick={() => handleInsertFilter()}>
                                Kreiraj
                            </button>
                        </div>
                    </div>
                </div>

                <div className="filter-bottom">
                    <div className="filter-selected">
                        <div className="filter-section-label">
                            <span>Odabrani periodi</span>
                        </div>
                        <div className="selected-group">
                            {selectedPeriods.length > 0 ? (
                                selectedPeriods.map(({ id, name, startTime, endTime }) => (
                                    <FilterItemSelected key={id}>
                                        <div className="filter-period-item">
                                            <span>{name}</span>
                                            <span>{formatPeriod(startTime, endTime)}</span>
                                            <IoIosClose
                                                className="filter-icon"
                                                size={40}
                                                color="red"
                                                onClick={() => handleRemoveSelectedPeriod(id)}
                                            />
                                        </div>
                                    </FilterItemSelected>
                                ))
                            ) : (
                                <div className="filter-item">
                                    <span>Nema odabranih perioda</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="filter-available">
                        <div className="filter-section-label">
                            <span>Mogući periodi</span>
                        </div>
                        <div className="available-group">
                            {availablePeriods.length > 0 ? (
                                availablePeriods.map(({ id, name, startTime, endTime }) => (
                                    <FilterAvailableCard
                                        key={id}
                                        onClick={() => handleAddSelectedPeriod(id)}
                                        className="filter-item use-hover"
                                    >
                                        <div className="filter-period-item">
                                            <span>{name}</span>
                                            <span>{formatPeriod(startTime, endTime)}</span>
                                        </div>
                                    </FilterAvailableCard>
                                ))
                            ) : (
                                <div className="filter-item">
                                    <span>Nema mogućih perioda</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default PeriodFilter;
