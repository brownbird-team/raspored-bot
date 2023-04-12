import React from "react";
import "./ViewChanges.css";
import ComponentHeader from "../../components/ComponentHeader";
import ComponentBody from "../../components/ComponentBody";
import { BiEdit } from "react-icons/bi";
import { useSelector } from "react-redux";

const ViewChanges = ({ onModifyChange }) => {
    const changes = useSelector((state) => state.change.changes);

    const handleModifyChange = (change) => {
        onModifyChange(change, "Promijeni");
    }

    return (
        <div className="view-changes">
            <ComponentHeader>
                <span>Sve izmjene predmeti / učionice</span>
            </ComponentHeader>
            <ComponentBody className="view-changes-body">
                <table className="changes-table">
                    <thead>
                        <tr>
                            <th>ID izmjene</th>
                            <th>Datum izmjene</th>
                            <th>Filter razreda</th>
                            <th>Filter perioda</th>
                            <th>Promijeni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {changes.length > 0 ? (
                            changes.map((change, index) => (
                                <tr key={index} className="view-change-item">
                                    <td>{index}</td>
                                    <td>{change.date}</td>
                                    <td>{change.classes.filterName}</td>
                                    <td>{change.periods.filterName}</td>
                                    <td><BiEdit size={25} className="icon" onClick={() => handleModifyChange(change)} /></td>
                                </tr>
                            ))
                        ) : (
							<tr className="view-change-item">
								<td colSpan="4">Nema izmjena predmeti / učionice</td>
							</tr>
                        )}
                    </tbody>
                </table>
            </ComponentBody>
        </div>
    );
};

export default ViewChanges;
