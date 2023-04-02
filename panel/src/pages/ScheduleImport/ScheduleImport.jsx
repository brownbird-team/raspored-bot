import React, { useRef, useState } from "react";
import "./ScheduleImport.css";
import MainLayout from "../../layouts/MainLayout";

const ScheduleImport = () => {
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
        <MainLayout>
            <div className="badge text-bg-secondary">
                <h4>Uvezi raspored sati</h4>
            </div>
            <div className="import-main">
                <div className="import-steps">
                    <h5>Koraci:</h5>
                    <ol>
                        <li className="badge text-bg-secondary">
                            1. Kliknite na <b>Odaberi</b> kako biste odabrali datoteku
                        </li>
                        <li className="badge text-bg-warning">
                            <b>2. Datoteka mora biti isključivo .xml</b>
                        </li>
                        <li className="badge text-bg-secondary">
                            3. Nakon što se .xml datoteka učita, kliknite na <b>Uvezi</b>
                        </li>
                    </ol>
                </div>
                <div className="import-body">
                    <input
                        type="file"
                        id="schedule-import"
                        accept="text/xml"
                        ref={fileInputRef}
                        onChange={handleOnChange}
                        required
                    />
                    <div className="import-choose-file">
                        <button type="button" className="btn btn-primary" onClick={handleButtonClick}>
                            Odaberi
                        </button>
                        {file ? (
                            <div className="import-file-info">
                                <div>
                                    <span>Filename:</span>
                                    <span>{file.name}</span>
                                </div>
                                <div>
                                    <span>Size:</span>
                                    <span>{file.size / 1000} KB</span>
                                </div>
                            </div>
                        ) : (
                            <div className="import-file-info no-upload">
                                <span>Datoteka nije prenesena</span>
                            </div>
                        )}
                    </div>

                    <button type="submit" className="btn btn-success" onClick={handleSubmitClick}>
                        Uvezi
                    </button>
                </div>
            </div>
        </MainLayout>
    );
};

export default ScheduleImport;
