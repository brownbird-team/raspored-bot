import React, { useState } from "react";
import "./Weeks.css";
import MainLayout from "../../layouts/MainLayout";
import ComponentHeader from "../../components/ComponentHeader";
import ComponentBody from "../../components/ComponentBody";
import PrimaryButton from "../../components/PrimaryButton";
import { useSelector, useDispatch } from "react-redux";
import { saveWeeksOrder } from "../../features/weeks";
import { IoIosClose } from "react-icons/io";
import { MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";

const pageItems = ["Tjedni"];

const Weeks = () => {
    const dispatch = useDispatch();
    const weeks = useSelector((state) => state.weeks.value);
    const weeksStored = useSelector((state) => state.weeks.weeksOrder);
    const [selectedWeeks, setSelectedWeeks] = useState(weeksStored);
    const [availableWeeks, setAvailableWeeks] = useState(
        weeks.filter((week) => {
            return weeksStored.findIndex((storedWeek) => storedWeek.id === week.id) === -1;
        })
    );

    // Handler koji dodaje novi tjedan u listu odabranih tjedana
    const handleAddSelectedWeek = (id) => {
        // Dodaje odabrani tjedan u listu odabranih tjedana
        const selectedWeek = availableWeeks.find((week) => week.id === id);
        if (selectedWeek) {
            setSelectedWeeks([...selectedWeeks, selectedWeek]);
        }

        // Filtrira nove tjedne tako da nova lista tjedana ne sadrži odabrani tjedan
        const newAvailableWeeks = availableWeeks.filter((week) => week.id !== id);
        setAvailableWeeks(newAvailableWeeks);
    };

    // Handler koji briše odabrani tjedan iz liste odabranih tjedana
    const handleRemoveSelectedWeek = (id) => {
        // Briše odabrani tjedan iz liste odabranih tjedana
        const newSelectedWeeks = selectedWeeks.filter((week) => week.id !== id);
        setSelectedWeeks(newSelectedWeeks);

        // Dodaje odabrani tjedan u listu mogućih tjedana u sortiranom obliku
        const selectedWeek = selectedWeeks.find((week) => week.id === id);
        if (selectedWeek) {
            const newAvailableWeeks = [...availableWeeks, selectedWeek];
            setAvailableWeeks(newAvailableWeeks.sort((a, b) => a.id - b.id));
        }
    };

    // Handler koji pomiče odabrani tjedan prema početku ili kraju liste tjedana
    const handleMoveSelectedWeek = (id, direction) => {
        if (selectedWeeks.at(0).id === id && direction === -1) return;
        if (selectedWeeks.at(-1).id === id && direction === 1) return;

        const selectedWeek = selectedWeeks.find((week) => week.id === id);
        const weekSecond = selectedWeeks[selectedWeeks.indexOf(selectedWeek) + direction];

        const newSelectedWeeks = [...selectedWeeks];
        newSelectedWeeks[selectedWeeks.indexOf(weekSecond)] = selectedWeek;
        newSelectedWeeks[selectedWeeks.indexOf(selectedWeek)] = weekSecond;

        setSelectedWeeks(newSelectedWeeks);
    };

    return (
        <MainLayout pageItems={pageItems}>
            <div className="weeks-main">
                <div className="weeks-selected">
                    <ComponentHeader>
                        <span>Odabrani tjedni</span>
                    </ComponentHeader>
                    <ComponentBody>
                        {selectedWeeks.length > 0 ? (
                            selectedWeeks.map(({ id, name }) => (
                                <button key={id} className="week-item">
                                    <div className="week-item-arrows">
                                        <MdOutlineKeyboardArrowUp
                                            size={25}
                                            onClick={() => handleMoveSelectedWeek(id, -1)}
                                        />
                                        <MdOutlineKeyboardArrowDown
                                            size={25}
                                            onClick={() => handleMoveSelectedWeek(id, 1)}
                                        />
                                    </div>
                                    <span>{name}</span>
                                    <IoIosClose size={40} color="red" onClick={() => handleRemoveSelectedWeek(id)} />
                                </button>
                            ))
                        ) : (
                            <div className="week-item">Nema odabranih tjedana</div>
                        )}
                    </ComponentBody>
                </div>
                <div className="weeks-available">
                    <ComponentHeader>
                        <span>Dostupni tjedni</span>
                    </ComponentHeader>
                    <ComponentBody>
                        {availableWeeks.length > 0 ? (
                            availableWeeks.map(({ id, name }) => (
                                <button key={id} className="week-item" onClick={() => handleAddSelectedWeek(id)}>
                                    <span>{name}</span>
                                </button>
                            ))
                        ) : (
                            <div className="week-item">Nema dostupnih tjedana</div>
                        )}
                    </ComponentBody>
                </div>
            </div>

            <div className="weeks-header">
                <ComponentHeader>
                    <span>Tjedni</span>
                </ComponentHeader>
                <ComponentBody className="p-4 week-save">
                    <PrimaryButton type="button" onClick={() => dispatch(saveWeeksOrder(selectedWeeks))}>
                        Spremi tjedne
                    </PrimaryButton>
                </ComponentBody>
            </div>
        </MainLayout>
    );
};

export default Weeks;
