import React, { useRef, useState } from "react";
import "./ScheduleImport.css";
import MainLayout from "../../layouts/MainLayout";
import ComponentHeader from "../../components/ComponentHeader";
import ComponentBody from "../../components/ComponentBody";
import ComponentFooter from "../../components/ComponentFooter";
import PrimaryButton from "../../components/PrimaryButton";
import SecondaryButton from "../../components/SecondaryButton";
import PrimaryCheckbox from "../../components/PrimaryCheckbox";
import Alert from "../../components/Alert";
import Options from "./utils/Options";
import { NotificationSuccess, NotificationWarning } from "../../services/notification";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

// Definiraj Page Items za Header
const pageItems = ["Uvezi raspored sati"];

const ScheduleImport = () => {
    const [openSteps, setOpenSteps] = useState(false);

    const [file, setFile] = useState(null);
    const [options, setOptions] = useState(new Options());
    const fileInputRef = useRef(null);

    const [alert, setAlert] = useState(null);

    // Handler koji postavlja trenutni file
    const handleOnChangeSchedule = () => {
        setFile(fileInputRef.current.files[0]);
    };

    // Handler koji triggera input file
    const handleOnChangeScheduleTrigger = () => {
        fileInputRef.current.click();
    };

    // Handler koji spremi novu vrijednost optiona
    const handleOnChangeOption = (option) => {
        switch (option) {
            case "classes":
                setOptions(options.setFilterClasses());
                break;
            case "periods":
                setOptions(options.setFilterPeriods());
                break;
            case "days":
                setOptions(options.setDays());
                break;
            case "weeks":
                setOptions(options.setWeeks());
                break;
            case "connection":
                setOptions(options.setSaveConnection());
                break;
        }
    }

    // Handler koji se pokreće kada korisnik pokuša uvesti raspored
    const handleOnImportSchedule = () => {
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
                            <div><span>1. Kliknite na <b className="highlight">Odaberi raspored</b> kako biste odabrali datoteku</span></div>
                            <div><span>2. <b className="highlight">Datoteka mora biti isključivo .xml</b></span></div>
                            <div><span>3. Nakon što se .xml datoteka učita, kliknite na <b className="highlight">Uvezi raspored</b></span></div>
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
                            onChange={handleOnChangeSchedule}
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
                            <div className="import-file-info no-upload"><span>Nije odabrana niti jedna datoteka</span></div>
                        )}
                        
                        {file ? (
                            <div className="import-schedule-checkboxes">
                                <PrimaryCheckbox onChange={() => handleOnChangeOption("classes")}>
                                    Uvezi već postojeće filtere razreda
                                </PrimaryCheckbox>
                                <PrimaryCheckbox onChange={() => handleOnChangeOption("periods")}>
                                    Uvezi već postojeće filtere perioda
                                    </PrimaryCheckbox>
                                <PrimaryCheckbox onChange={() => handleOnChangeOption("days")}>
                                    Uvezi već postojeće dane u tjednu
                                    </PrimaryCheckbox>
                                <PrimaryCheckbox onChange={() => handleOnChangeOption("weeks")}>
                                    Uvezi već postojeći redoslijed tjedana
                                    </PrimaryCheckbox>
                                <PrimaryCheckbox onChange={() => handleOnChangeOption("connection")}>
                                    Poveži postojeću vezu između korisnika i razreda na temelju novog naziva razreda
                                </PrimaryCheckbox>
                            </div>
                        ) : null}
                        
                    </ComponentBody>

                    <ComponentFooter>
                        <SecondaryButton onClick={handleOnChangeScheduleTrigger}>Odaberi raspored</SecondaryButton>
                        <PrimaryButton type="submit" onClick={handleOnImportSchedule}>
                            Uvezi raspored
                        </PrimaryButton>
                    </ComponentFooter>
                </div>
            </div>
        </MainLayout>
    );
};

export default ScheduleImport;
