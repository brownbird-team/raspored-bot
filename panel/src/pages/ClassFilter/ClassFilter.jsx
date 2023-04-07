import React, { useState } from "react";
import "./InputField.css";
import MainLayout from "../../layouts/MainLayout";
import FilterAvailableCard from "../../components/Filter/FilterAvailableCard";
import FilterList from "../../components/Filter/FilterList";
import Alert from "../../components/Alert";
import FilterSelectedCard from "../../components/Filter/FilterSelectedCard";
import { useSelector, useDispatch } from "react-redux";
import { addClassFilter, updateClassFilter, removeClassFilter } from "../../features/classFilter";
import { validateFilter } from "../../services/validateFilter";
import statusCodes from "../../data/constants/messageFilter";
import { IoIosClose } from "react-icons/io";

// Definiraj Page Items za Header
const pageItems = ["Filteri razreda"];

const ClassFilter = () => {
    const dispatch = useDispatch();

    // Dohvaća sve spremljene razrede
    const allClasses = useSelector((state) => state.classes.value);
    // Dohvaća sve spremljene filtere razreda
    const storedFilters = useSelector((state) => state.classFilter.filters);

    const [alert, setAlert] = useState(null);
    const [availableClasses, setAvailableClasses] = useState(allClasses);
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [filterName, setFilterName] = useState("");
    const [filterUniqueId, setFilterUniqueId] = useState(null);
    const [filterAction, setFilterAction] = useState("create");

    // Handler koji dodaje novi razred u listu odabranih razreda
    const handleAddSelectedClass = (classId) => {
        const findClass = availableClasses.find(({ id }) => id === classId);
        if (findClass) {
            const newAvailableClasses = [...availableClasses].filter(({ id }) => id !== findClass.id);
            const newSelectedClass = [...selectedClasses, findClass];
            setAvailableClasses(newAvailableClasses);
            setSelectedClasses(newSelectedClass);
        }
    };

    // Handler koji briše odabrani razred iz liste odabranih razreda
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

    // Handler koji dodaje odabrane periode u novi filter
    const handleInsertFilter = () => {
        const newFilter = { filterName: filterName, classes: selectedClasses };

        switch (
            filterAction === "create"
                ? validateFilter(newFilter, storedFilters)
                : validateFilter(newFilter, storedFilters, true)
        ) {
            case statusCodes.EMPTY_FILTERNAME:
                setAlert({ message: statusCodes.EMPTY_FILTERNAME, type: "danger" });
                break;
            case statusCodes.EMPTY_CLASSES:
                setAlert({ message: statusCodes.EMPTY_CLASSES, type: "danger" });
                break;
            case statusCodes.EXIST_FILTERNAME:
                setAlert({ message: statusCodes.EXIST_FILTERNAME, type: "danger" });
                break;
            case statusCodes.FILTER_CREATED:
                setAlert({
                    message: (
                        <>
                            {statusCodes.FILTER_CREATED} <b className="highlight">{filterName}</b>
                        </>
                    ),
                    type: "success",
                });
                dispatch(addClassFilter(newFilter));
                resetToInitialState();
                break;
            case statusCodes.FILTER_CHANGED:
                setAlert({
                    message: (
                        <>
                            {statusCodes.FILTER_CHANGED} <b className="highlight">{filterName}</b>
                        </>
                    ),
                    type: "success",
                });
                dispatch(updateClassFilter({ ...newFilter, uniqueId: filterUniqueId }));
                resetToInitialState();
                break;
        }
    };

    // Handler koji briše odabrani postojeći razred
    const handleClassOnDelete = (filterName) => {
        // Briše filter razreda iz stora
        dispatch(removeClassFilter(filterName));
        // Šalje poruku korisniku
        setAlert({
            message: (
                <>
                    {statusCodes.SUCCESSFULLY_DELETED} <b className="highlight">{filterName}</b>
                </>
            ),
            type: "success",
        });
        // Vraća vrijednosti stateova na početno stanje
        resetToInitialState();
    };

    // Handler koji se pokreće nakon što se odabere opcija edit razreda
    const handleClassOnEdit = (filterName, uniqueId, classes) => {
        // Postavlja sve dostupne razrede
        setAvailableClasses(allClasses.filter((obj1) => !classes.some((obj2) => obj2.id === obj1.id)));
        // Postavlja sve odabrane razrede
        setSelectedClasses(classes);
        // Postavlja naziv filtera
        setFilterName(filterName);
        // Postavlja id filtera
        setFilterUniqueId(uniqueId);
        // Postavlja vrstu radnje
        setFilterAction("edit");
    };

    const resetToInitialState = () => {
        setAvailableClasses(allClasses);
        setFilterName("");
        setSelectedClasses([]);
        setFilterUniqueId(null);
        setFilterAction("create");
    };

    return (
        <MainLayout pageItems={pageItems}>
            <div className="filter-main">
                {alert ? (
                    <Alert type={alert.type} onClose={() => setAlert(null)}>
                        {alert.message}
                    </Alert>
                ) : null}

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
                            {filterAction === "edit" ? (
                                <button type="button" className="cancel-btn" onClick={() => resetToInitialState()}>
                                    Zatvori
                                </button>
                            ) : null}
                            <button type="button" className="change-btn" onClick={() => handleInsertFilter()}>
                                {filterAction === "edit" ? "Promijeni" : "Kreiraj"}
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
                                    <FilterSelectedCard key={id}>
                                        <span>{label}</span>
                                        <IoIosClose
                                            className="filter-icon"
                                            size={40}
                                            color="red"
                                            onClick={() => handleRemoveSelectedClass(id)}
                                        />
                                    </FilterSelectedCard>
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
                            <span>Dostupni razredi</span>
                        </div>
                        <div className="available-group">
                            {availableClasses.length > 0 ? (
                                availableClasses.map(({ id, label }) => (
                                    <FilterAvailableCard
                                        key={id}
                                        onClick={() => handleAddSelectedClass(id)}
                                        className="filter-item use-hover"
                                    >
                                        <span>{label}</span>
                                    </FilterAvailableCard>
                                ))
                            ) : (
                                <div className="filter-item">
                                    <span>Nema dostupnih razreda</span>
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
                            onDelete={() => handleClassOnDelete(filterName)}
                            onEdit={() => handleClassOnEdit(filterName, uniqueId, classes)}
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
