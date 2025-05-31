import React from "react";
import Modal from "../components/Modal";

const ModalAction = ({ openModal, setOpenModal }) => {
	return (
		<Modal
			visible={openModal}
			preventClose
			onClose={() => setOpenModal(false)}
			className="p-4"
		>
			<div>halo</div>
		</Modal>
	);
};

export default ModalAction;
