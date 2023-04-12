import React, { useState } from "react";
import "./CreateChange.css";
import ComponentHeader from "../../components/ComponentHeader";
import ComponentBody from "../../components/ComponentBody";
import ComponentFooter from "../../components/ComponentFooter";
import PrimaryButton from "../../components/PrimaryButton";
import { useSelector, useDispatch } from "react-redux";
import { addChange } from "../../features/changes";

const CreateChange = ({ onCreateChange }) => {
	const dispatch = useDispatch();
    const classesAll = useSelector((state) => state.classes.filters);
    const periodsAll = useSelector((state) => state.periods.filters);

	const [selectedClasses, setSelectedClasses] = useState(classesAll[0] ? classesAll[0] : null);
	const [selectedPeriods, setSelectedPeriods] = useState(periodsAll[0] ? periodsAll[0] : null);
	const [date, setDate] = useState(null);

	const handleSetSelectedClasses = (filterName) => {
		setSelectedClasses(classesAll.find((filter) => filter.filterName === filterName));
	}

	const handleSetSelectedPeriods = (filterName) => {
		setSelectedPeriods(periodsAll.find((filter) => filter.filterName === filterName));
	}

	const handleSetDate = (date) => {
		setDate(date);
	}

	const handleCreateChange = () => {
		const change = {classes: selectedClasses, periods: selectedPeriods, date: date};
		dispatch(addChange(change));
        onCreateChange(change, "Kreiraj");
	}

    return (
        <div className="create-change">
            <ComponentHeader>
                <span>Kreiraj izmjenu</span>
            </ComponentHeader>
            <ComponentBody className="p-4">
                <div className="create-change-input">
                    <span>Odaberi filter razreda</span>
                    <select className="custom-select" onChange={(e) => handleSetSelectedClasses(e.target.value)}>
                        {classesAll.map(({ filterName }) => (
                            <option key={filterName} value={filterName}>{filterName}</option>
                        ))}
                    </select>
                </div>
                <div className="create-change-input">
                    <span>Odaberi filter perioda</span>
                    <select className="custom-select" onChange={(e) => handleSetSelectedPeriods(e.target.value)}>
                        {periodsAll.map(({ filterName }) => (
                            <option key={filterName} value={filterName}>{filterName}</option>
                        ))}
                    </select>
                </div>
                <div className="create-change-input">
					<span>Odaberi datum izmjene</span>
					<input type="date" required className="custom-datepicker"
						onChange={(e) => handleSetDate(e.target.value)}
					/>
				</div>
            </ComponentBody>
			<ComponentFooter>
			    <PrimaryButton type="button" onClick={handleCreateChange}>Spremi</PrimaryButton>
			</ComponentFooter>
        </div>
    );
};

export default CreateChange;
