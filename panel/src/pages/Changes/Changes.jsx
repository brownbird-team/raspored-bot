import React, { useEffect, useState } from "react";
import "./Changes.css";
import MainLayout from "../../layouts/MainLayout";
import * as Component from "../../components";
import CreateChange from "./utils/CreateChange";
import ChangesTableCreate from "./ChangesTableCreate";
import ChangesTableEdit from "./ChangesTableEdit";
import { NotificationSuccess, NotificationWarning } from "../../services/Notification";
import { useShifts, useChanges, useToken } from "../../store/hooks";
import { addShifts } from "../../features/shifts";
import { addChanges, setChangeId, setChangeEdit, setChangeMorningAndShift } from "../../features/changes";
import { useDispatch } from "react-redux"; 
import { BiEdit } from "react-icons/all";
import API_HOST from "../../data/api";

const Changes = () => {

    const dispatch = useDispatch();
    const token = useToken();

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
    }, []);

    const changes = useChanges();

    const [change, setChange] = useState(new CreateChange("Izmjene u rasporedu sati", new Date(), shifts[0], true));
    const [updateTrigger, setUpdateTrigger] = useState(false);
    const [alert, setAlert] = useState(null);
    const [showChangeTable, setShowChangeTable] = useState(null);

    useEffect(() => {
        const getTableChanges = async() => {
            const res = await fetch(`${API_HOST}/api/change`, {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin" : `${API_HOST}:3000`,
                },
                method: "GET",
            });

            const changes = await res.json();
            dispatch(addChanges(changes));
        }

        getTableChanges();
    }, [updateTrigger]);

    // Handler koji promijeni naziv tablice izmjena
    const handleOnChangeName = (value) => setChange(change.setName(value));

    // Handler koji promijeni datum tablice izmjena
    const handleOnChangeDate = (value) => setChange(change.setDate(value));

    // Handler koji promijeni smjenu izmjena
    const handleOnChangeShift = (value) => setChange(change.setShift(value));

    // Handler koji promijeni turnus izmjena
    const handleOnChangeMorning = (value) => setChange(change.setMorning(value));

    // Handler koji kreira novu tablicu izmjena
    const handleOnCreate = async() => {
        const finishChange = change;

        if (!finishChange.validateName())
            return setAlert(new NotificationWarning(<>Polje <b className="highlight">Naziv izmjene</b> ne smije biti prazno</>))

        if (!finishChange.validateDate()) 
            return setAlert(new NotificationWarning(<>Datum nove izmjene ne može biti u <b className="highlight">prošlosti</b></>))

        finishChange.setHeading();
        console.log(finishChange);
        const postTable = async() => {
            const res = await fetch(`${API_HOST}/api/change`, {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin" : `${API_HOST}`,
                    "Authorization" : `Bearer ${token}`
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
                    dispatch(setChangeId(result.newChangeId));
                    dispatch(setChangeMorningAndShift({ morning: finishChange.getMorning(), shift: finishChange.getShift() }));
                    setUpdateTrigger(!updateTrigger);
                    setShowChangeTable("create");
                    break;
                }
            }
        }

        await postTable();        
    }

    // Handler koji povlači izmjenu prema id-u tablice izmjena
    const handleOnEdit = async(id) => {
        dispatch(setChangeId(id));

        const getChangeById = async() => {
			const res = await fetch(`${API_HOST}/api/change/content?id=${id}`, {
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin" : `${API_HOST}:3000`,
				},
				method: "GET",
			});
 
			const { content, status } = await res.json();
			dispatch(setChangeEdit(content));

            switch (status) {
                case "error": {
                    setAlert(new NotificationWarning(<>Došlo je do pogreške prilikom učitavanja izmjene tablice</>));
                    break;
                }
                case "ok": {
                    if (content.classes.length > 0) {
                        setShowChangeTable("edit");
                    } else {
                        dispatch(setChangeMorningAndShift({ morning: content.morning, shift: content.shift }));
                        setShowChangeTable("create");
                    }
                    
                    break;
                }
            }
        }

		await getChangeById();
    }

    return <MainLayout pageItems={["Izmjene sati"]}>
        <div className="layout-space changes-main">
            {alert ? <Component.Alert type={alert.type} onClose={() => setAlert(null)}>{alert.message}</Component.Alert> : null}
            
            {showChangeTable === null ? (
                <>
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
                                        <option key={index} value={shift}>{shift}</option>
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
                
                    <div className="changes-edit">
                        <Component.Header>
                            <span>Pregled svih izmjena</span>
                        </Component.Header>
                        <Component.Body className="changes-edit-body">
                            {changes.length > 0 ? (
                                <table className="custom-table changes-edit-body-table">
                                <thead>
                                    <tr>
                                        <th className="change-table-center">Naziv izmjene</th>
                                        <th>Smjena</th>
                                        <th className="change-table-center">Turnus</th>
                                        <th>Promijeni</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {changes.map(({ id, heading, shift, morning }, index) => (
                                        <tr key={index} className="change-table-edit-row">
                                            <td className="change-table-center">{heading}</td>
                                            <td className="change-table-small">{shift}</td>
                                            <td className="change-table-center">{morning ? "Prijepodne" : "Poslijepodne"}</td>
                                            <td className="change-table-small icon" 
                                                onClick={() => handleOnEdit(id)}><BiEdit size={25} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            ) : (
                                <div className="change-table-edit-no-records">Nema izmjena</div>
                            )}
                            

                        </Component.Body>
                    </div>
                </>
            ) : showChangeTable === "create" ? (
                <ChangesTableCreate onBack={() => setShowChangeTable(null)} setAlert={setAlert} />
            ) : showChangeTable === "edit" ? (
                <ChangesTableEdit onBack={() => setShowChangeTable(null)} setAlert={setAlert}/>
            ) : null}

        </div>
    </MainLayout>;
};

export default Changes;
