import React, { useState } from "react";
import "./style/Changes.css";
import MainLayout from "../../layouts/MainLayout";
import Alert from "../../components/Alert";
import ChangeCreate from "./ChangeCreate";
import ChangesView from "./ChangesView";
import ChangeController from "./ChangeController";

const pageItems = ["Izmjene u predmetima / učionicama"]

const Changes = () => {
    const [change, setChange] = useState(null);
    const [changeLabel, setChangeLabel] = useState(null);

    const [alert, setAlert] = useState(null);

    const handleSetChange = (change, label) => {
        setChange(change);
        setChangeLabel(label);
    }

    return (
        <MainLayout pageItems={pageItems} className="changes-main">
            {alert ? (
                <Alert type={alert.type} onClose={() => setAlert(null)}>
                    {alert.message}
                </Alert>
            ) : null}
            {change ? (
                <ChangeController change={change} changeLabel={changeLabel} onBack={() => setChange(null)} />
            ) : (
                <>
                    <ChangeCreate onCreateChange={(change, label) => handleSetChange(change, label)} setAlert={setAlert} />
                    <ChangesView onModifyChange={(change, label) => handleSetChange(change, label)}/>
                </>
            )}
        </MainLayout>
    );
};

export default Changes;
