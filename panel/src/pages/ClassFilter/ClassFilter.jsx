import React, { useState } from "react";
import "./ClassFilter.css";
import MainLayout from "../../layouts/MainLayout";
import InputField from "../../components/InputField";
import FilterAvailableCard from "../../components/Filter/FilterAvailableCard";
import ClassList from "./ClassList";
import { IoIosClose } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { setClassFilter } from "../../features/classFilter";
import { validateFilterName } from "./utils/validateInput";

const ClassFilter = () => {
    // Dohvati sve razrede
    const classes = useSelector((state) => state.classes.value);

    // Dohvati sve filtere razreda
    const storedFilters = useSelector((state) => state.classFilter.value);

    const [availableClasses, setAvailableClasses] = useState(classes);
    const [selectedClasses, setSelectedClasses] = useState([]);

    const dispatch = useDispatch();

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

    const handleValidateFilterName = (value) => {
        const newFilter = { filterName: value, values: selectedClasses };
        if (validateFilterName(newFilter, storedFilters)) {
            dispatch(setClassFilter(newFilter));
            setSelectedClasses([]);
            setAvailableClasses(classes);
        }
    };

    return (
        <MainLayout>
            <h4>Filteri razreda</h4>
            <div className="filter-main">
                <div className="filter-left">
                    <div className="filter-heading">
                        <span>Naziv filtera</span>
                        <InputField
                            type="text"
                            name="Dodaj"
                            placeholder="Naziv filtera"
                            onClick={(value) => handleValidateFilterName(value)}
                        />
                    </div>
                    <div className="filter-selected">
                        <span>Odabrani razredi</span>
                        {selectedClasses.length > 0 ? (
                            selectedClasses.map(({ id, label }) => (
                                <div key={id}>
                                    <div className="filter-item use-hover">
                                        <span>{label}</span>
                                        <IoIosClose
                                            className="filter-icon"
                                            size={40}
                                            color="red"
                                            onClick={() => handleRemoveSelectedClass(id)}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="filter-item">
                                <span>Nema odabranih razreda</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="filter-available">
                    <div className="filter-item">
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

            <div className="filter-list-main">
                <div className="filter-list-header">
                    <span>Popis svih filtera razreda</span>
                </div>
                {storedFilters.map((storedFilter) => (
                    <ClassList key={storedFilter.filterName} filter={storedFilter} />
                ))}
            </div>
        </MainLayout>
    );
};

export default ClassFilter;
