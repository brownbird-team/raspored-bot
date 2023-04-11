import React, { useRef, useState } from "react";
import "./ScheduleImport.css";
import MainLayout from "../../layouts/MainLayout";
import ComponentHeader from "../../components/ComponentHeader";
import ComponentBody from "../../components/ComponentBody";
import ComponentFooter from "../../components/ComponentFooter";
import PrimaryButton from "../../components/PrimaryButton";
import SecondaryButton from "../../components/SecondaryButton";
import Alert from "../../components/Alert";
import { NotificationSuccess, NotificationWarning } from "../../services/notification";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

// Definiraj Page Items za Header
const pageItems = ["Uvezi raspored sati"];

const ScheduleImport = () => {
    // Definira state za otvaranja / zatvaranje
    const [openSteps, setOpenSteps] = useState(false);

    // Definira state za unos rasporeda
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    // Definira state za alert poruku
    const [alert, setAlert] = useState(null);

    const handleOnChange = () => {
        setFile(fileInputRef.current.files[0]);
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    // Handler koji se pokreće kada korisnik pokuša uvesti raspored
    const handleSubmitClick = () => {
        if (file) {
            // Dohvaća ekstenziju datoteke
            const fileExtension = file.name.split(".").pop();

            // Provjerava je li datoteka xml
            if (fileExtension !== "xml") return setAlert(new NotificationWarning(<>Datoteka <b className="highlight">{file.name}</b> nije <b className="highlight">.xml</b></>));

            return setAlert(new NotificationSuccess(<>Datoteka <b className="highlight">{file.name}</b> je uspješno prenešena</>));
        } else return setAlert(new NotificationWarning(<>Nije odabrana niti jedna datoteka</>));
    };

    return (
        <MainLayout pageItems={pageItems}>
            <div className="import-main">
                {alert ? (
                    <Alert type={alert.type} onClose={() => setAlert(null)}>
                        {alert.message}
                    </Alert>
                ) : null}

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

                    <ComponentBody className="p-4">
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
                                <thead>
                                    <tr>
                                        <th>Naziv datoteke</th>
                                        <th>Veličina</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{file.name}</td>
                                        <td>{file.size / 1000} KB</td>
                                    </tr>
                                </tbody>
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
