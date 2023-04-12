import React, { useState } from "react";
import "./style/ChangeTable.css";
import ComponentHeader from "../../components/ComponentHeader";
import ComponentBody from "../../components/ComponentBody";
import ComponentFooter from "../../components/ComponentFooter";
import PrimaryButton from "../../components/PrimaryButton";
import SecondaryButton from "../../components/SecondaryButton";
import ChangeModal from "./ChangeModal";
import { useSelector } from "react-redux";

const ChangeTable = ({ onBack }) => {
    const changeActive = useSelector((state) => state.change.changeActive);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [cell, setCell] = useState(null);

	const handleOnClickCell = (classId, periodId) => {
		const selectedClass = changeActive.classFilter.classes.find(({ id }) => id === classId);
		const selectedPeriod = changeActive.periodFilter.periods.find(({ id }) => id === periodId); 
		setCell({selectedClass, selectedPeriod});
		setIsModalOpen(!isModalOpen);
	}

    return (
		<>
			<div className="change-table-main">
				<table className="change-table">
					<thead>
						<tr>
							<td className="table-filter">{changeActive.periodFilter.filterName}</td>
							{changeActive.periodFilter.periods.map(({ name }, index) => (
								<td key={index} className="table-filter">{name}</td>
							))}
						</tr>
					</thead>
					<tbody>
						{changeActive.classFilter.classes.map((classs, classIndex) => (
							<tr key={classIndex}>
								<td className="table-filter">{classs.label}</td>

								{changeActive.periodFilter.periods.map((period, periodIndex) => (
									<td key={periodIndex} 
										className="table-content" 
										onClick={() => handleOnClickCell(classs.id, period.id)}>	
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>

				
				<ComponentFooter className="change-table-footer">
					<SecondaryButton type="button" onClick={onBack}>Natrag</SecondaryButton>
					<PrimaryButton type="button">Objavi</PrimaryButton>
				</ComponentFooter>
			</div>

			{isModalOpen ? <ChangeModal cellData={cell} onClose={() => setIsModalOpen(false)}/> : null}
		</>
    );
};

export default ChangeTable;
