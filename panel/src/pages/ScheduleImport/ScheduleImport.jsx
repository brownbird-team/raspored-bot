import React, { useRef, useState } from "react";
import "./ScheduleImport.css";
import MainLayout from "../../layouts/MainLayout";
import ComponentHeader from "../../components/ComponentHeader";
import ComponentBody from "../../components/ComponentBody";
import ComponentFooter from "../../components/ComponentFooter";
import PrimaryButton from "../../components/PrimaryButton";
import SecondaryButton from "../../components/SecondaryButton";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

// Definiraj Page Items za Header
const pageItems = ["Uvezi raspored sati"];

const ScheduleImport = () => {
    const [openSteps, setOpenSteps] = useState(false);

    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleOnChange = () => {
        setFile(fileInputRef.current.files[0]);
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmitClick = () => {
        console.log(file);
    };

    return (
        <MainLayout pageItems={pageItems}>
            <div className="import-main">
                <div className="import-steps" style={{ height: openSteps ? "15rem" : "3.5rem" }}>
                    <div className="import-steps-header icon" onClick={() => setOpenSteps(!openSteps)}>
                        <span>Koraci</span>
                        <MdOutlineKeyboardArrowDown size={30} className={`icon ${openSteps ? "up" : "down"}`} />
                    </div>
                    {openSteps ? (
                        <div className="import-steps-container">
                            <div>
                                <span>
                                    1. Kliknite na <b className="highlight">Odaberi raspored</b> kako biste odabrali
                                    datoteku
                                </span>
                            </div>
                            <div>
                                <span>
                                    2. <b className="highlight">Datoteka mora biti isključivo .xml</b>
                                </span>
                            </div>
                            <div>
                                <span>
                                    3. Nakon što se .xml datoteka učita, kliknite na{" "}
                                    <b className="highlight">Uvezi raspored</b>
                                </span>
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="import-body">
                    <ComponentHeader>
                        <span>Odabir rasporeda</span>
                    </ComponentHeader>

                    <ComponentBody>
                        <input
                            type="file"
                            id="schedule-import"
                            accept="text/xml"
                            ref={fileInputRef}
                            onChange={handleOnChange}
                            required
                        />
                        {file ? (
                            <table className="file-table">
                                <tr>
                                    <th>Naziv datoteke</th>
                                    <th>Veličina</th>
                                </tr>
                                <tr>
                                    <td>{file.name}</td>
                                    <td>{file.size / 1000} KB</td>
                                </tr>
                            </table>
                        ) : (
                            <div className="import-file-info no-upload">
                                <span>Nije odabrana niti jedna datoteka</span>
                            </div>
                        )}
                    </ComponentBody>

                    <ComponentFooter>
                        <SecondaryButton onClick={handleButtonClick}>Odaberi raspored</SecondaryButton>
                        <PrimaryButton type="submit" onClick={handleSubmitClick}>
                            Uvezi raspored
                        </PrimaryButton>
                    </ComponentFooter>
                </div>
            </div>
        </MainLayout>
    );
};

export default ScheduleImport;
