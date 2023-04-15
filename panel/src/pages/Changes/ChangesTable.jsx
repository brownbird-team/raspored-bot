import React, { useState, useEffect } from "react";
import "./ChangesTable.css";
import * as Component from "../../components";
import TableContent from "./utils/TableContent";
import { NotificationSuccess, NotificationWarning } from "../../services/Notification";
import { useClassesShift, useChangeId } from "../../store/hooks";
import { addClassesByShift } from "../../features/classes";
import { useDispatch } from "react-redux";
import API_HOST from "../../data/api";

const ChangesTable = ({ data, onBack, setAlert }) => {

	const dispatch = useDispatch();

	const { morning, shift } = data;
	const periods = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]; 
	const changeId = useChangeId();

	const classesShift = useClassesShift();
	
	useEffect(() => {
        const getClassesByShift = async() => {
            const res = await fetch(`${API_HOST}/api/general/shift?name=${shift}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin" : `${API_HOST}:3000`,
                },
                method: "GET",
            });

            const classesShift = await res.json();
            dispatch(addClassesByShift(classesShift));
        }

        getClassesByShift();
    }, []);

	const changesTemplate = Array.from(classesShift, ({ id }) => ({ classId: id, sat1: "", sat2: "", sat3: "", sat4: "", sat5: "", sat6: "", sat7: "", sat8: "", sat9: "" }));

	const change = new TableContent(changeId, changesTemplate);

	const handleOnChange = (value, selectedClassId, selectedPeriod) => {
		const newTableContent = change.getClasses();
		const row = newTableContent.find((cls) => cls.classId === selectedClassId);
		row[`sat${selectedPeriod}`] = value;
	}

	const handlePublishChange = async() => {

		const postChange = async() => {
			const res = await fetch(`${API_HOST}/api/change/content`, {
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin" : `${API_HOST}:3000`,
				},
				method: "POST",
				body: JSON.stringify(change)
			});

			const result = await res.json();

			switch(result.status) {
                case "error": {
                    setAlert(new NotificationWarning(<>Došlo je do pogreške prilikom objave tablice izmjene</>));
                    break;
                }
                case "ok": {
                    setAlert(new NotificationSuccess(<>Uspješno je kreirana <b className="highlight">nova izmjena</b></>));
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
					<th className="table-heading">{morning ? "Prijepodne" : "Poslijepodne"}</th>
					{periods.map((period, index) => (
						<th key={index} className="table-heading">{morning ? period : period - 2}</th>
					))}
				</tr>
			</thead>
			<tbody>
				{classesShift.map((cls, cIndex) => (
					<tr key={cIndex}>
						<td className="table-heading">{cls.name}</td>

						{periods.map((period, pIndex) => (
							<td 
								key={pIndex}
								className="table-content"
							>
								<input 
									type="text" 
									className="table-data-input" 
									onChange={(event) => handleOnChange(event.target.value, cls.id, period) }
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

export default ChangesTable;
