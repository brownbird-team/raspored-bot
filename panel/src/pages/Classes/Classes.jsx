import React, { useState } from "react";
import "./Classes.css";
import MainLayout from "../../layouts/MainLayout";
import ComponentHeader from "../../components/ComponentHeader";
import ComponentBody from "../../components/ComponentBody";
import ComponentFooter from "../../components/ComponentFooter";
import PrimaryButton from "../../components/PrimaryButton";
import CreateClass from "./utils/CreateClass";
import Alert from "../../components/Alert";
import { NotificationSuccess, NotificationWarning } from "../../services/Notification";
import { useClasses } from "../../store/hooks"; 
import { MdDelete } from "react-icons/md"

const Classes = () => {

    const classes = useClasses();
    const [newClass, setNewClass] = useState(new CreateClass());
    const [alert, setAlert] = useState(null);

    const handleAddClassName = (value) => setNewClass(newClass.setClassName(value));

    const handleAddShift = (value) => setNewClass(newClass.setShift(value));

    const handleOnAddClass = () => {

        if (!newClass.validate()) 
            return setAlert(new NotificationWarning(
                <>Polja <b className="highlight">Naziv razreda</b> i <b className="highlight">Naziv smjene</b> ne smiju biti prazna</>
            ))
        
        setAlert(new NotificationSuccess(<>Uspješno je dodan novi razred <b className="highlight">{newClass.getClassName()}</b></>));
        
    }

    return (
        <MainLayout pageItems={["Razredi"]}>
            <div className="layout-space classes-main">
                {alert ? <Alert type={alert.type} onClose={() => setAlert(null)}>{alert.message}</Alert> : null}
                <div className="classes-create">
                    <ComponentHeader>
                        <span>Dodaj novi razred</span>
                    </ComponentHeader>
                    <ComponentBody className="classes-create-body">
                        <input 
                            type="text" 
                            placeholder="Naziv razreda" 
                            className="custom-input-box"
                            onChange={(event) => handleAddClassName(event.target.value)}
                            required 
                        />
                        <input 
                            type="text" 
                            placeholder="Naziv smjene" 
                            className="custom-input-box"
                            onChange={(event) => handleAddShift(event.target.value)}
                            required 
                        />
                    </ComponentBody>
                    <ComponentFooter>
                        <PrimaryButton type="button" onClick={handleOnAddClass}>Dodaj</PrimaryButton>
                    </ComponentFooter>
                </div>

                <div className="classes-view">
                    <ComponentHeader>
                        <span>Pregled svih razreda</span>
                    </ComponentHeader>
                    <ComponentBody className="classes-view-body">
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
                                    {classes.map(({ name, shift }, index) => (
                                        <tr key={index}>
                                            <td>{name}</td>
                                            <td>{shift}</td>
                                            <td><MdDelete size={25} className="delete icon" /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="class-view-item">Nije dodan niti jedan razred</div>
                        )}
                    </ComponentBody>
                </div>
            </div>
        </MainLayout>
    );
};

export default Classes;
