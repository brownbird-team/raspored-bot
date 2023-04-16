import React from "react";
import "./ChangesTable.css";
import * as Component from "../../components";
import TableContent from "./utils/TableContent";
import { NotificationSuccess, NotificationWarning } from "../../services/Notification";
import { useChangeEdit } from "../../store/hooks";
import API_HOST from "../../data/api";

const ChangesTableEdit = ({ onBack, setAlert }) => {

	const periods = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]; 
	const change = useChangeEdit();
	console.log(change)

	const changesTemplate = Array.from(change.classes, ({ classId, sat1, sat2, sat3, sat4, sat5, sat6, sat7, sat8, sat9 }) => ({ classId, sat1, sat2, sat3, sat4, sat5, sat6, sat7, sat8, sat9 }))
	const newChange = new TableContent(change.id, changesTemplate);

	// Handler koji promijeni vrijednost označene ćelije
	const handleOnChange = (value, selectedClassId, selectedPeriod) => {
		const newTableContent = newChange.getClasses();
		const row = newTableContent.find((cls) => cls.classId === selectedClassId);
		row[`sat${selectedPeriod}`] = value;
	}

	// Handler koji objavi novu izmjenu
	const handlePublishChange = async() => {

		const postChange = async() => {
			const res = await fetch(`${API_HOST}/api/change/content`, {
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin" : `${API_HOST}:3000`,
				},
				method: "POST",
				body: JSON.stringify(newChange)
			});

			const result = await res.json();

			switch(result.status) {
                case "error": {
                    setAlert(new NotificationWarning(<>Došlo je do pogreške prilikom objave tablice izmjene</>));
                    break;
                }
                case "ok": {
                    setAlert(new NotificationSuccess(<>Uspješno je promijenjena <b className="highlight">nova izmjena</b></>));
                    break;
                }
            }
		}

		await postChange();
		onBack();
	}

    return <div className="change-table-main">
		<table className="change-table">
			<thead>
				<tr>
					<th className="table-heading">{change.morning ? "Prijepodne" : "Poslijepodne"}</th>
					{periods.map((period, index) => (
						<th key={index} className="table-heading">{change.morning ? period : period - 2}</th>
					))}
				</tr>
			</thead>
			<tbody>
				{change.classes.map((cls, cIndex) => (
					<tr key={cIndex}>
						<td className="table-heading">{cls.className}</td>

						{periods.map((period, pIndex) => (
							<td 
								key={pIndex}
								className="table-content"
							>
								<input 
									type="text" 
									className="table-data-input" 
									onChange={(event) => handleOnChange(event.target.value, cls.classId, period) }
									defaultValue={cls[`sat${period}`]}
								></input>
							</td>

						))}
					</tr>
				))}
			</tbody>
		</table>

		<Component.Footer className="change-table-footer">
			<Component.SecondaryButton type="button" onClick={onBack}>Natrag</Component.SecondaryButton>
			<Component.PrimaryButton type="button" onClick={handlePublishChange}>Objavi</Component.PrimaryButton>
		</Component.Footer>
	</div>;
};

export default ChangesTableEdit;
