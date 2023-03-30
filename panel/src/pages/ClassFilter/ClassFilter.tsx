import React, { useState } from "react";
import "./ClassFilter.css";
import MainLayout from "../../layouts/MainLayout";
import InputField from "../../components/InputField";
import classes from "../../__tests__/classes.json";
import { IoIosClose } from "react-icons/io";

const ClassFilter = () => {
  const [availableClasses, setAvailableClasses] = useState(classes);
  const [selectedClasses, setSelectedClasses] = useState<
    { id: number; label: string }[]
  >([]);

  const handleRemoveAvailableClass = (classId: number) => {
    const findClass = availableClasses.find(({ id }) => id === classId);
    if (findClass) {
      const newAvailableClasses = [...availableClasses].filter(
        ({ id }) => id !== findClass.id
      );
      const newSelectedClass = [...selectedClasses, findClass];
      setAvailableClasses(newAvailableClasses);
      setSelectedClasses(newSelectedClass);
    }
  };

  const handleRemoveSelectedClass = (classId: number) => {
    const findClass = selectedClasses.find(({ id }) => id === classId);
    if (findClass) {
      const newSelectedClasses = [...selectedClasses].filter(
        ({ id }) => id !== findClass.id
      );
      const newAvailableClasses = [...availableClasses, findClass];

      // Soritraj po Class IDu
      newAvailableClasses.sort((a, b) => a.id - b.id);

      setAvailableClasses(newAvailableClasses);
      setSelectedClasses(newSelectedClasses);
    }
  };

  return (
    <MainLayout>
      <h4>Filteri razreda</h4>
      <div className="filter-main">
        <div className="filter-left">
          <div className="filter-heading">
            <span>Naziv filtera</span>
            <InputField type="text" name="Dodaj" placeholder="Naziv filtera" />
          </div>
          <div className="filter-selected">
            {selectedClasses.length > 0
              ? selectedClasses.map(({ id, label }) => (
                  <div key={id}>
                    <div className="filter-item">
                      <span>{label}</span>
                      <IoIosClose
                        className="filter-remove-icon"
                        size={40}
                        color="red"
                        onClick={() => handleRemoveSelectedClass(id)}
                      />
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div>
        <div className="filter-available">
          {availableClasses.map(({ id, label }) => (
            <button
              key={id}
              className="filter-item"
              onClick={() => handleRemoveAvailableClass(id)}
            >
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default ClassFilter;
