import React, { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import CreateChange from "./CreateChange";
import ViewChanges from "./ViewChanges";
import ChangeController from "./ChangeController";

const pageItems = ["Odabir razreda i perioda"]

const SubjectClassroomChanges = () => {
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
                    <CreateChange onCreateChange={(change, label) => handleSetChange(change, label)} />
                    <ViewChanges onModifyChange={(change, label) => handleSetChange(change, label)}/>
                </>
            )}
        </MainLayout>
    );
};

export default SubjectClassroomChanges;
