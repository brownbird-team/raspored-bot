import React, { useEffect, useState, useRef } from "react";
import "./Classes.css";
import MainLayout from "../../layouts/MainLayout";
import * as Component from "../../components";
import CreateClass from "./utils/CreateClass";
import { NotificationSuccess, NotificationWarning } from "../../services/Notification";
import { useClasses } from "../../store/hooks";
import { useDispatch } from "react-redux"; 
import { MdDelete } from "react-icons/md"
import { addClasses } from "../../features/classes";
import API_HOST from "../../data/api";

const Classes = () => {

    const dispatch = useDispatch();

    const [newClass, setNewClass] = useState(new CreateClass());
    const [updateTrigger, setUpdateTrigger] = useState(false);
    const [alert, setAlert] = useState(null);
    const nameRef = useRef(null);
    const shiftRef = useRef(null);

    const classes = useClasses();
 
    useEffect(() => {
        const fetchClassesAll = async() => {
            const res = await fetch(`${API_HOST}/api/general/classes/active`, {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin" : `${API_HOST}:3000`,
                },
                method: "GET",
            });

            const classes = await res.json();
            dispatch(addClasses(classes))
        }

        fetchClassesAll();
    }, [updateTrigger])

    const handleAddClassName = (value) => setNewClass(newClass.setName(value));

    const handleAddShift = (value) => setNewClass(newClass.setShift(value));

    const handleOnAddClass = async() => {

        if (!newClass.validate()) 
            return setAlert(new NotificationWarning(
                <>Polja <b className="highlight">Naziv razreda</b> i <b className="highlight">Naziv smjene</b> ne smiju biti prazna</>
            ))


        const postClass = async() => {
            const res = await fetch(`${API_HOST}/api/general/class`, {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin" : `${API_HOST}`,
                },
                method: "POST",
                body: JSON.stringify(newClass)
            });

            const result = await res.json();
            setUpdateTrigger(!updateTrigger);
            
            switch(result.status) {
                case "error": {
                    setAlert(new NotificationWarning(<>Došlo je do pogreške prilikom dodavanja novog razreda</>));
                    break;
                }
                case "ok": {
                    setAlert(new NotificationSuccess(<>Uspješno je dodan novi razred <b className="highlight">{newClass.getName()}</b></>));
                    break;
                }
            }
        }

        await postClass();

        setNewClass(new CreateClass());
        nameRef.current.value = "";
        shiftRef.current.value = "";
        
    }

    const handleOnDeleteClass = async(id) => {
        
        const deleteClass = async() => {
            const res = await fetch(`${API_HOST}/api/general/class?id=${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin" : `${API_HOST}`,
                },
                method: "DELETE",
            });

            const result = await res.json();
            console.log(result);
            switch(result.status) {
                case "error": {
                    setAlert(new NotificationWarning(<>Došlo je do pogreške prilikom brisanja novog razreda</>));
                    break;
                }
                case "ok": {
                    setAlert(new NotificationSuccess(<>Uspješno je obrisan razred <b className="highlight">{classes.find((cls) => cls.id === id).name}</b></>));
                    break;
                }
            }

            setUpdateTrigger(!updateTrigger);
        }

        await deleteClass();
    }

    return (
        <MainLayout pageItems={["Razredi"]}>
            <div className="layout-space classes-main">
                {alert ? (
                    <Component.Alert type={alert.type} onClose={() => setAlert(null)}>
                        {alert.message}
                    </Component.Alert>
                ) : null}

                <div className="classes-create">
                    <Component.Header>
                        <span>Dodaj novi razred</span>
                    </Component.Header>
                    <Component.Body className="classes-create-body">
                        <input
                            type="text"
                            placeholder="Naziv razreda"
                            className="custom-input-box"
                            onChange={(event) => handleAddClassName(event.target.value)}
                            required
                            ref={nameRef}
                        />
                        <input
                            type="text"
                            placeholder="Naziv smjene"
                            className="custom-input-box"
                            onChange={(event) => handleAddShift(event.target.value)}
                            required
                            ref={shiftRef}
                        />
                    </Component.Body>
                    <Component.Footer>
                        <Component.PrimaryButton type="button" onClick={handleOnAddClass}>
                            Dodaj
                        </Component.PrimaryButton>
                    </Component.Footer>
                </div>

                <div className="classes-view">
                    <Component.Header>
                        <span>Pregled svih razreda</span>
                    </Component.Header>
                    <Component.Body className="classes-view-body">
                        {classes.length > 0 ? (
                            <table className="custom-table classes-table">
                                <thead className="classes-table-head">
                                    <tr>
                                        <th>Naziv razreda</th>
                                        <th>Smjena razreda</th>
                                        <th>Obriši razred</th>
                                    </tr>
                                </thead>
                                <tbody className="classes-table-body">
                                    {classes.map(({ id, name, shift }, index) => (
                                        <tr key={index}>
                                            <td>{name}</td>
                                            <td>{shift}</td>
                                            <td>
                                                <MdDelete 
                                                    size={25} 
                                                    className="delete icon"
                                                    onClick={() => handleOnDeleteClass(id)} 
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="class-view-item">Nije dodan niti jedan razred</div>
                        )}
                    </Component.Body>
                </div>
            </div>
        </MainLayout>
    );
};

export default Classes;
