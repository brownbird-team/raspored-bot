import React, { useState } from "react";
import "./ClassFilter.css";
import "./InputField.css";
import MainLayout from "../../layouts/MainLayout";
import FilterAvailableCard from "../../components/Filter/FilterAvailableCard";
import ClassList from "./ClassList";
import ClassSelected from "./ClassSelected";
import { useSelector, useDispatch } from "react-redux";
import { setClassFilter, updateClassFilter } from "../../features/classFilter";
import { validateNewFilter, validateExistFilter } from "./utils/validateInput";

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
        resetToDefault();
    };

    const resetToDefault = () => {
        setAvailableClasses(allClasses);
        setFilterName("");
        setSelectedClasses([]);
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
                        />
                        <button type="button" className="change-btn" onClick={() => handleValidateFilter()}>
                            {action === "edit" ? "Promijeni" : "Kreiraj"}
                        </button>
                        {action === "edit" ? (
                            <button type="button" className="btn btn-danger" onClick={() => resetToDefault()}>
                                Zatvori
                            </button>
                        ) : null}
                    </div>
                </div>
                <div className="filter-bottom">
                    <div className="filter-selected">
                        <div className="filter-section-label">
                            <span>Odabrani razredi</span>
                        </div>
                        {selectedClasses.length > 0 ? (
                            selectedClasses.map(({ id, label }) => (
                                <ClassSelected key={id} label={label} onClick={() => handleRemoveSelectedClass(id)} />
                            ))
                        ) : (
                            <div className="filter-item">
                                <span>Nema odabranih razreda</span>
                            </div>
                        )}
                    </div>
                    <div className="filter-available">
                        <div className="filter-section-label">
                            <span>Mogući razredi</span>
                        </div>
                        <div className="available-classes">
                            {availableClasses.map(({ id, label }) => (
                                <FilterAvailableCard
                                    key={id}
                                    label={label}
                                    onClick={() => handleRemoveAvailableClass(id)}
                                    className="filter-item use-hover"
                                />
                            ))}
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
                        <ClassList
                            key={filterName}
                            filter={{ filterName, uniqueId, classes }}
                            onClick={() => {
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
