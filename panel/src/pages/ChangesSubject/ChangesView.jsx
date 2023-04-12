import React from "react";
import "./style/ChangesView.css";
import ComponentHeader from "../../components/ComponentHeader";
import ComponentBody from "../../components/ComponentBody";
import { BiEdit } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import { setActiveChange } from "../../features/changes";

const ChangesView = ({ onModifyChange }) => {
    const dispatch = useDispatch();
    const changes = useSelector((state) => state.change.changes);

    const handleModifyChange = (change) => {
        dispatch(setActiveChange(change));
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
                                    <td>{change.classFilter.filterName}</td>
                                    <td>{change.periodFilter.filterName}</td>
                                    <td><BiEdit size={25} className="icon" onClick={() => handleModifyChange(change)} /></td>
                                </tr>
                            ))
                        ) : (
							<tr className="view-change-item">
								<td colSpan="5">Nema izmjena predmeti / učionice</td>
							</tr>
                        )}
                    </tbody>
                </table>
            </ComponentBody>
        </div>
    );
};

export default ChangesView;
