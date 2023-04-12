import React from "react";
import "./ChangeController.css";
import ComponentHeader from "../../components/ComponentHeader";
import ComponentBody from "../../components/ComponentBody";
import ComponentFooter from "../../components/ComponentFooter";
import PrimaryButton from "../../components/PrimaryButton";
import SecondaryButton from "../../components/SecondaryButton";

const ChangeController = ({ change, changeLabel, onBack }) => {
	// Kasnije zamijeniti s APIJEM
	const date = new Date();
	const versions = [
		{id: 1, date: `${date.getDate()}.${date.getDay()}.${date.getFullYear()}`, time: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`},
		{id: 2, date: `${date.getDate()}.${date.getDay()}.${date.getFullYear()}`, time: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`},
		{id: 3, date: `${date.getDate()}.${date.getDay()}.${date.getFullYear()}`, time: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`},
	]

    return (
        <div className="change-controller">
            <div className="change-controller-info">
                <ComponentHeader>
                    <span>
                        Izmjena u rasporedu za <b className="custom-badge">{change.date}</b>
                    </span>
                </ComponentHeader>
                <ComponentBody className="p-4">
                    <div className="change-controller-item">
                        <span className="change-item-title">Skupina razreda</span>
                        <span>
                            <b className="highlight">{change.classes.filterName}</b>
                        </span>
                    </div>
                    <div className="change-controller-item">
                        <span className="change-item-title">Skupina perioda</span>
                        <span>
                            <b className="highlight">{change.periods.filterName}</b>
                        </span>
                    </div>
                    <div className="change-controller-item">
                        <span className="change-item-title">Dan</span>
                        <span>
                            <b className="highlight">Ponedjeljak</b>
                        </span>
                    </div>
                    <div className="change-controller-item">
                        <span className="change-item-title">Tjedan</span>
                        <span>
                            <b className="highlight">Week A</b>
                        </span>
                    </div>
                </ComponentBody>
                <ComponentFooter>
                    <SecondaryButton type="button" onClick={onBack}>
                        Natrag
                    </SecondaryButton>
                    <PrimaryButton type="button">{changeLabel} izmjenu</PrimaryButton>
                </ComponentFooter>
            </div>

            <div className="change-controller-versions">
                <ComponentHeader>
                    <span>Verzije izmjene</span>
                </ComponentHeader>
                <ComponentBody className="view-changes-body">
                    <table className="changes-table">
                        <thead>
                            <tr>
                                <th>ID verzije</th>
                                <th>Datum verzije</th>
                                <th>Vrijeme verzije</th>
                            </tr>
                        </thead>
                        <tbody>
                            {versions.length > 0 ? versions.map(({ id, date, time }) => (
                                <tr key={id} className="view-change-item">
                                    <td>{id}</td>
                                    <td>{date}</td>
                                    <td>{time}</td>
                                </tr>
                            )) : (
								<tr className="view-change-item">
									<td colSpan={4}>Nema verzija izmjene</td>
								</tr>
							)}
                        </tbody>
                    </table>
                </ComponentBody>
            </div>
        </div>
    );
};

export default ChangeController;
