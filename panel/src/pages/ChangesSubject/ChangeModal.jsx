import React from "react";
import "./style/ChangeModal.css";
import ComponentHeader from "../../components/ComponentHeader";
import ComponentBody from "../../components/ComponentBody";
import ComponentFooter from "../../components/ComponentFooter";
import { IoMdClose } from "react-icons/io";

const ChangeModal = ({ cellData: { selectedClass, selectedPeriod }, onClose }) => {
    return <div className="change-modal">
		<ComponentHeader className="change-modal-header">
			<div className="change-modal-header-cell-details">
				<div className="cell-detail">
					<span>Razred</span>
					<span><b className="custom-badge">{selectedClass.label}</b></span>
				</div>
				<div className="cell-detail">
					<span>Sat</span>
					<span><b className="custom-badge">{selectedPeriod.name}</b></span>
				</div>
			</div>
			<IoMdClose size={25} className="icon" onClick={onClose} />
		</ComponentHeader>
		<ComponentBody>

		</ComponentBody>
	</div>;
};

export default ChangeModal;
