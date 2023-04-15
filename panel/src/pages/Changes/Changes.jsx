import React, { useEffect, useState } from "react";
import "./Changes.css";
import MainLayout from "../../layouts/MainLayout";
import * as Component from "../../components";
import ChangesTable from "./ChangesTable";
import CreateChange from "./utils/CreateChange";
import { NotificationSuccess, NotificationWarning } from "../../services/Notification";
import { useShifts } from "../../store/hooks";
import { addShifts } from "../../features/shifts";
import { setChangeId } from "../../features/changes";
import { useDispatch } from "react-redux"; 
import API_HOST from "../../data/api";

const Changes = () => {

    const dispatch = useDispatch();

    const [change, setChange] = useState(new CreateChange(
        "Izmjene u rasporedu sati", new Date(), "A", true
    ));
    const [updateTrigger, setUpdateTrigger] = useState(false);
    const [alert, setAlert] = useState(null);
    const [showChangeTable, setShowChangeTable] = useState(false);

    const shifts = useShifts();

    useEffect(() => {
        const getShifts = async() => {
            const res = await fetch(`${API_HOST}/api/general/shifts`, {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin" : `${API_HOST}:3000`,
                },
                method: "GET",
            });

            const shifts = await res.json();
            dispatch(addShifts(shifts));
        }

        getShifts();
    }, [updateTrigger]);

    const handleOnChangeName = (value) => setChange(change.setName(value));

    const handleOnChangeDate = (value) => setChange(change.setDate(value));

    const handleOnChangeShift = (value) => setChange(change.setShift(value));

    const handleOnChangeMorning = (value) => setChange(change.setMorning(value));

    const handleOnCreate = () => {
        const finishChange = change;

        if (!finishChange.validateName())
            return setAlert(new NotificationWarning(<>Polje <b className="highlight">Naziv izmjene</b> ne smije biti prazno</>))

        if (!finishChange.validateDate()) 
            return setAlert(new NotificationWarning(<>Datum nove izmjene ne može biti u <b className="highlight">prošlosti</b></>))

        setAlert(null);
        setShowChangeTable(true);
        finishChange.setHeading();

        const postTable = async() => {
            const res = await fetch(`${API_HOST}/api/change`, {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin" : `${API_HOST}`,
                },
                method: "POST",
                body: JSON.stringify(finishChange)
            });

            const result = await res.json();

            switch(result.status) {
                case "error": {
                    setAlert(new NotificationWarning(<>Došlo je do pogreške prilikom kreiranja tablice izmjene</>));
                    break;
                }
                case "ok": {
                    setAlert(new NotificationSuccess(<>Uspješno je kreirana nova tablica izmjene <b className="highlight">{finishChange.getHeading()}</b></>));
                    dispatch(setChangeId(result));
                    break;
                }
            }
        }
        
        postTable();
    }

    return <MainLayout pageItems={["Izmjene sati"]}>
        <div className="layout-space changes-main">
            {alert ? <Component.Alert type={alert.type} onClose={() => setAlert(null)}>{alert.message}</Component.Alert> : null}
            
            {!showChangeTable ? (
                <div className="changes-create">
                    <Component.Header>
                        <span>Kreiraj izmjenu u rasporedu sati</span>
                    </Component.Header>
                    <Component.Body className="changes-body">

                        <div className="changes-input-group">
                            <input 
                                type="text" 
                                placeholder="Naziv izmjene" 
                                className="custom-input-box"
                                defaultValue={change.getName()}
                                onChange={(event) => handleOnChangeName(event.target.value)}
                                required 
                            />
                            <input 
                                type="date" 
                                className="custom-datepicker"
                                defaultValue={change.getDate().toISOString().substring(0, 10)}
                                onChange={(event) => handleOnChangeDate(event.target.value)}
                                required 
                            />
                        </div>

                        <div className="changes-input-group">
                            <span>Smjena</span>
                            
                            <select 
                                className="custom-select" 
                                defaultValue={change.getShift()}
                                onChange={(event) => handleOnChangeShift(event.target.value)}
                            >
                                {shifts.map((shift, index) => (
                                    <option key={index}>{shift}</option>
                                ))}
                            </select>

                            <select 
                                className="custom-select"
                                defaultValue={change.getMorning()}
                                onChange={(event) => handleOnChangeMorning(event.target.value)}
                            >
                                <option value="true">Prijepodne</option>
                                <option value="false">Poslijepodne</option>
                            </select>
                        </div>

                    </Component.Body>
                    <Component.Footer>
                        <Component.PrimaryButton type="button" onClick={handleOnCreate}>Kreiraj izmjenu</Component.PrimaryButton>
                    </Component.Footer>
                </div>
            ) : (
                <ChangesTable data={change} onBack={() => setShowChangeTable(false)} setAlert={setAlert}/>
            )}

        </div>
    </MainLayout>;
};

export default Changes;
