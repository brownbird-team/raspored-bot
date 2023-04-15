import React from "react";
import "./PrimaryCheckbox.css";

const PrimaryCheckbox = ({ children, defaultChecked=true, onChange }) => {
    return (
		<div className="primary-checkbox-container">
			<input 
				type="checkbox" 
				className="primary-checkbox" 
				defaultChecked={ defaultChecked }
				onChange={onChange}
			/>
			<span>{children}</span>
		</div>
	);
};

export default PrimaryCheckbox;
