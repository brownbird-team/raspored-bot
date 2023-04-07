import React, { useState } from "react";
import "./ClassFilter.css";
import "./InputField.css";
import MainLayout from "../../layouts/MainLayout";
import FilterAvailableCard from "../../components/Filter/FilterAvailableCard";
import FilterList from "../../components/Filter/FilterList";
import FilterItemSelected from "../../components/Filter/FilterItemSelected";
import { useSelector, useDispatch } from "react-redux";
import { setClassFilter, updateClassFilter, removeClassFilter } from "../../features/classFilter";
import { validateNewFilter, validateExistFilter } from "./utils/validateInput";
import { IoIosClose } from "react-icons/io";

// Definiraj Page Items za Header
const pageItems = ["Filteri razreda"];

const ClassFilter = () => {
    const dispatch = useDispatch();

    // Dohvati sve razrede
    const allClasses = useSelector((state) => state.classes.value);

    // Dohvati sve filtere razreda
    const storedFilters = useSelector((state) => state.classFilter.filters);

    const [availableClasses, setAvailableClasses] = useState(allClasses);
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [filterName, setFilterName] = useState("");

    // Definiraj za postojeće filtere uniqueId
    const [uniqueId, setUniqueId] = useState(null);

    // Definiraj tip actiona
    const [action, setAction] = useState("create");

    const handleRemoveAvailableClass = (classId) => {
        const findClass = availableClasses.find(({ id }) => id === classId);
        if (findClass) {
            const newAvailableClasses = [...availableClasses].filter(({ id }) => id !== findClass.id);
            const newSelectedClass = [...selectedClasses, findClass];
            setAvailableClasses(newAvailableClasses);
            setSelectedClasses(newSelectedClass);
        }
    };

    const handleRemoveSelectedClass = (classId) => {
        const findClass = selectedClasses.find(({ id }) => id === classId);
        if (findClass) {
            const newSelectedClasses = [...selectedClasses].filter(({ id }) => id !== findClass.id);
            const newAvailableClasses = [...availableClasses, findClass];

            // Soritraj po class id
            newAvailableClasses.sort((a, b) => a.id - b.id);

            setAvailableClasses(newAvailableClasses);
            setSelectedClasses(newSelectedClasses);
        }
    };

    const handleValidateFilter = () => {
        const newFilter = { filterName: filterName, classes: selectedClasses };
        switch (action) {
            case "create":
                if (validateNewFilter(newFilter, storedFilters)) dispatch(setClassFilter(newFilter));
                break;
            case "edit":
                if (validateExistFilter({ ...newFilter, uniqueId: uniqueId }, storedFilters))
                    dispatch(updateClassFilter({ ...newFilter, uniqueId: uniqueId }));
                break;
        }
        resetToInitialState();
    };

    const resetToInitialState = () => {
        setAvailableClasses(allClasses);
        setFilterName("");
        setSelectedClasses([]);
        setUniqueId(null);
        setAction("create");
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
                            className="custom-input-box"
                        />
                        <div className="input-buttons">
                            {action === "edit" ? (
                                <button type="button" className="cancel-btn" onClick={() => resetToInitialState()}>
                                    Zatvori
                                </button>
                            ) : null}
                            <button type="button" className="change-btn" onClick={() => handleValidateFilter()}>
                                {action === "edit" ? "Promijeni" : "Kreiraj"}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="filter-bottom">
                    <div className="filter-selected">
                        <div className="filter-section-label">
                            <span>Odabrani razredi</span>
                        </div>
                        <div className="selected-group">
                            {selectedClasses.length > 0 ? (
                                selectedClasses.map(({ id, label }) => (
                                    <FilterItemSelected key={id}>
                                        <span>{label}</span>
                                        <IoIosClose
                                            className="filter-icon"
                                            size={40}
                                            color="red"
                                            onClick={() => handleRemoveSelectedClass(id)}
                                        />
                                    </FilterItemSelected>
                                ))
                            ) : (
                                <div className="filter-item">
                                    <span>Nema odabranih razreda</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="filter-available">
                        <div className="filter-section-label">
                            <span>Mogući razredi</span>
                        </div>
                        <div className="available-group">
                            {availableClasses.length > 0 ? (
                                availableClasses.map(({ id, label }) => (
                                    <FilterAvailableCard
                                        key={id}
                                        onClick={() => handleRemoveAvailableClass(id)}
                                        className="filter-item use-hover"
                                    >
                                        <span>{label}</span>
                                    </FilterAvailableCard>
                                ))
                            ) : (
                                <div className="filter-item">
                                    <span>Nema mogućih razreda</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="filter-list-main">
                <div className="filter-list-header">
                    <span>Popis svih filtera razreda</span>
                </div>
                {storedFilters.length ? (
                    storedFilters.map(({ filterName, uniqueId, classes }) => (
                        <FilterList
                            key={filterName}
                            filter={{ filterName, uniqueId, classes }}
                            onDelete={() => {
                                dispatch(removeClassFilter(filterName));
                                resetToInitialState();
                            }}
                            onEdit={() => {
                                setAvailableClasses(
                                    allClasses.filter((obj1) => !classes.some((obj2) => obj2.id === obj1.id))
                                );
                                setFilterName(filterName);
                                setSelectedClasses(classes);
                                setUniqueId(uniqueId);
                                setAction("edit");
                            }}
                        />
                    ))
                ) : (
                    <div className="filter-item">
                        <span>Nema definiranih filtera razreda</span>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default ClassFilter;
