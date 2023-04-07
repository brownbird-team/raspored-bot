import React, { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import FilterSelectedCard from "../../components/Filter/FilterSelectedCard";
import FilterAvailableCard from "../../components/Filter/FilterAvailableCard";
import FilterList from "../../components/Filter/FilterList";
import Alert from "../../components/Alert";
import { useSelector, useDispatch } from "react-redux";
import { addPeriodFilter, updatePeriodFilter, removePeriodFilter } from "../../features/periodFilter";
import { formatPeriod } from "./utils/formatPeriod";
import { validateFilter } from "../../services/validateFilter";
import statusCodes from "../../data/constants/messageFilter";
import { IoIosClose } from "react-icons/io";

// Definiraj Page Items za Header
const pageItems = ["Filteri perioda"];

const PeriodFilter = () => {
    const dispatch = useDispatch();

    // Dohvaća sve spremljene periode
    const allPeriods = useSelector((state) => state.periods.value);
    // Dohvaća sve spremljene filtere perioda
    const storedFilters = useSelector((state) => state.periodFilter.filters);

    const [alert, setAlert] = useState(null);
    const [availablePeriods, setAvailablePeriods] = useState(allPeriods);
    const [selectedPeriods, setSelectedPeriods] = useState([]);
    const [filterName, setFilterName] = useState("");
    const [filterAction, setFilterAction] = useState("create");
    const [filterUniqueId, setFilterUniqueId] = useState(null);

    // Handler koji dodaje novi period u listu odabranih perioda
    const handleAddSelectedPeriod = (id) => {
        // Dodaje odabrani period u listu odabranih perioda
        const selectedPeriod = availablePeriods.find((period) => period.id === id);
        if (selectedPeriod) {
            setSelectedPeriods([...selectedPeriods, selectedPeriod]);
        }

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
        if (selectedPeriod) {
            const newAvailablePeriods = [...availablePeriods, { ...selectedPeriod, name: id }];
            setAvailablePeriods(newAvailablePeriods.sort((a, b) => a.id - b.id));
        }
    };

    // Handler koji ažurira novo ime perioda
    const handleUpdateSelectedPeriodName = (id, newName) => {
        setSelectedPeriods(
            selectedPeriods.map((period) => {
                return period.id === id ? { ...period, name: newName } : period;
            })
        );
    };

    // Handler koji dodaje odabrane periode u novi filter
    const handleInsertFilter = () => {
        const newFilter = { filterName: filterName, periods: selectedPeriods };
        switch (
            filterAction === "create"
                ? validateFilter(newFilter, storedFilters)
                : validateFilter(newFilter, storedFilters, true)
        ) {
            case statusCodes.EMPTY_FILTERNAME:
                setAlert({ message: statusCodes.EMPTY_FILTERNAME, type: "danger" });
                break;
            case statusCodes.EMPTY_PERIODS:
                setAlert({ message: statusCodes.EMPTY_PERIODS, type: "danger" });
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
                dispatch(addPeriodFilter(newFilter));
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
                dispatch(updatePeriodFilter({ ...newFilter, uniqueId: filterUniqueId }));
                resetToInitialState();
                break;
        }
    };

    // Handler koji briše odabrani postojeći period
    const handlePeriodOnDelete = (filterName) => {
        // Briše filter perioda iz stora
        dispatch(removePeriodFilter(filterName));
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

    // Handler koji se pokreće nakon što se odabere opcija edit perioda
    const handlePeriodOnEdit = (filterName, uniqueId, periods) => {
        // Postavlja sve dostupne periode
        setAvailablePeriods(allPeriods.filter((obj1) => !periods.some((obj2) => obj2.id === obj1.id)));
        // Postavlja sve odabrane periode
        setSelectedPeriods(periods);
        // Postavlja naziv filtera
        setFilterName(filterName);
        // Postavlja id filtera
        setFilterUniqueId(uniqueId);
        // Postavlja vrstu radnje
        setFilterAction("edit");
    };

    // Funkcija koja resetira sve stateove na početne vrijednosti
    const resetToInitialState = () => {
        setAvailablePeriods(allPeriods);
        setSelectedPeriods([]);
        setFilterName("");
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
                            <span>Odabrani periodi</span>
                        </div>
                        <div className="selected-group">
                            {selectedPeriods.length > 0 ? (
                                selectedPeriods.map(({ id, name, startTime, endTime }) => (
                                    <FilterSelectedCard key={id}>
                                        <div className="filter-period-item">
                                            <input
                                                type="text"
                                                placeholder="Naziv perioda"
                                                defaultValue={name}
                                                className="custom-input-box"
                                                onChange={(e) => handleUpdateSelectedPeriodName(id, e.target.value)}
                                            />
                                            <span>{formatPeriod(startTime, endTime)}</span>
                                            <IoIosClose
                                                className="filter-icon"
                                                size={40}
                                                color="red"
                                                onClick={() => handleRemoveSelectedPeriod(id)}
                                            />
                                        </div>
                                    </FilterSelectedCard>
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
                            <span>Dostupni periodi</span>
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
                                    <span>Nema dostupnih perioda</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="filter-list-main">
                <div className="filter-list-header">
                    <span>Popis svih filtera perioda</span>
                </div>
                {storedFilters.length ? (
                    storedFilters.map(({ filterName, uniqueId, periods }) => (
                        <FilterList
                            key={filterName}
                            filter={{ filterName, uniqueId, periods }}
                            onDelete={() => handlePeriodOnDelete(filterName)}
                            onEdit={() => handlePeriodOnEdit(filterName, uniqueId, periods)}
                        />
                    ))
                ) : (
                    <div className="filter-item">
                        <span>Nema definiranih filtera perioda</span>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default PeriodFilter;
