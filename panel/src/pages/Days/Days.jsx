import React, { useState } from "react";
import "./Days.css";
import MainLayout from "../../layouts/MainLayout";
import ComponentHeader from "../../components/ComponentHeader";
import ComponentBody from "../../components/ComponentBody";
import PrimaryButton from "../../components/PrimaryButton";
import Alert from "../../components/Alert";
import { useSelector, useDispatch } from "react-redux";
import { saveDaysOfWeek } from "../../features/days";
import { NotificationSuccess, NotificationWarning } from "../../services/notification";

const pageItems = ["Dani"];

const Days = () => {
    const dispatch = useDispatch();
    const days = useSelector((state) => state.days.value);
    const [daysOfWeek, setDaysOfWeek] = useState(days);
    const [alert, setAlert] = useState(null);

    // Handler koji promijeni naziv dana za odabrani dan
    const handleUpdateDayOfWeek = (id, dayOfWeek) => {
        setDaysOfWeek(
            daysOfWeek.map((day) => {
                return day.id === id ? { ...day, dayOfWeek: dayOfWeek } : day;
            })
        );
    };

    // Handler koji sprema sve nazive dana u tjednu
    const handleSaveDaysOfWeek = () => {
        const uniqueDaysOfWeek = [];
        // Izdvaja sve nazive dana koji su definirani
        const daysOfWeekNotEmpty = daysOfWeek.filter(({ dayOfWeek }) => dayOfWeek !== null);

        // Sprema sve unikatne nazive dana u array uniqueDaysOfWeek
        daysOfWeekNotEmpty.map(({ dayOfWeek }) => {
            if (!uniqueDaysOfWeek.includes(dayOfWeek)) return uniqueDaysOfWeek.push(dayOfWeek);
        });

        // Uspoređuje duljine dvaju arraya te ako nisu jednaki ispiše odgovarajuću poruku korisniku
        if (uniqueDaysOfWeek.length !== daysOfWeekNotEmpty.length)
            return setAlert(new NotificationWarning(<>Nazivi dana u tjednu moraju biti <b className="highlight">jedinstveni</b></>));

        // Šalje array daysOfWeek kao payload za action saveDaysOfWeek
        dispatch(saveDaysOfWeek(daysOfWeek));
        setAlert(new NotificationSuccess(<>Uspješno su spremljeni nazivi dana u tjednu</>))
    };

    return (
        <MainLayout pageItems={pageItems}>
            <div className="days-main">
                {alert ? (
                    <Alert type={alert.type} onClose={() => setAlert(null)}>
                        {alert.message}
                    </Alert>
                ) : null}

                <div>
                    <ComponentHeader>
                        <span>Dani u tjednu</span>
                    </ComponentHeader>
                    <ComponentBody className="days-body">
                        <div className="days">
                            {days.map(({ id, name }) => (
                                <div key={id} className="day-item">
                                    <span>{name}</span>
                                    <select onChange={(e) => handleUpdateDayOfWeek(id, e.target.value)} className="custom-select">
                                        <option value="null">Ne koristi se</option>
                                        <option value="mon">Ponedjeljak</option>
                                        <option value="tue">Utorak</option>
                                        <option value="wed">Srijeda</option>
                                        <option value="thu">Četvrtak</option>
                                        <option value="fri">Petak</option>
                                        <option value="sat">Subota</option>
                                        <option value="sun">Nedjelja</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                        <PrimaryButton type="button" onClick={handleSaveDaysOfWeek}>
                            Spremi dane
                        </PrimaryButton>
                    </ComponentBody>
                </div>
            </div>
        </MainLayout>
    );
};

export default Days;
