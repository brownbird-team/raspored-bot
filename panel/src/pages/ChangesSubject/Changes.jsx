import React, { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import ChangeCreate from "./ChangeCreate";
import ChangesView from "./ChangesView";
import ChangeController from "./ChangeController";

const pageItems = ["Izmjene u predmetima / učionicama"]

const Changes = () => {
    const [change, setChange] = useState(null);
    const [changeLabel, setChangeLabel] = useState(null);

    const handleSetChange = (change, label) => {
        setChange(change);
        setChangeLabel(label);
    }

    return (
        <MainLayout pageItems={pageItems} className="p-4">
            {change ? (
                <ChangeController change={change} changeLabel={changeLabel} onBack={() => setChange(null)} />
            ) : (
                <>
                    <ChangeCreate onCreateChange={(change, label) => handleSetChange(change, label)} />
                    <ChangesView onModifyChange={(change, label) => handleSetChange(change, label)}/>
                </>
            )}
        </MainLayout>
    );
};

export default Changes;
