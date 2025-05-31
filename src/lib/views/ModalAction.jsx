import React, { useState } from "react";
import Modal from "../components/Modal";
import Dropdown from "../components/Dropdown";
import Button from "../components/Button";

const ModalAction = ({ openModal, setOpenModal }) => {
	const [activeTab, setActiveTab] = useState("origin");

	const originOptions = [
		{ label: "BANDUNG", value: "BDG" },
		{ label: "JAKARTA", value: "JKT" },
		{ label: "SURABAYA", value: "SBY" },
		{ label: "DENPASAR", value: "DPS" },
		{ label: "MALANG", value: "MLG" },
	];

	const destionationOptions = [
		{ label: "MEDAN", value: "MDN" },
		{ label: "BANJARMASIN", value: "BJM" },
		{ label: "PEKANBARU", value: "PKU" },
		{ label: "PALEMBANG", value: "PLB" },
		{ label: "BALIKPAPAN", value: "BPN" },
	];

	return (
		<Modal visible={openModal} preventClose onClose={() => setOpenModal(false)}>
			<div className="p-4 min-h-[450px] h-full flex flex-col justify-between">
				<div className="flex flex-col gap-4">
					{/* Tabs */}
					<div className="flex gap-4">
						<button
							onClick={() => setActiveTab("origin")}
							className={`px-4 py-2 rounded-t font-semibold ${
								activeTab === "origin"
									? "border-b-2 border-green-500 text-green-500"
									: "text-gray-500"
							}`}
						>
							Origin
						</button>
						<button
							onClick={() => setActiveTab("destination")}
							className={`px-4 py-2 rounded-t font-semibold ${
								activeTab === "destination"
									? "border-b-2 border-green-500 text-green-500"
									: "text-gray-500"
							}`}
						>
							Destination
						</button>
					</div>

					{activeTab === "origin" ? (
						<div className="w-full">
							<Dropdown type="multi" items={originOptions} />
						</div>
					) : (
						<div className="w-full">
							<Dropdown type="multi" items={destionationOptions} />
						</div>
					)}
				</div>

				{/* Action Buttons */}
				<div className="border-t flex justify-end gap-4 p-2">
					<button className="text-gray-500 hover:underline">Reset</button>
					<Button size="small" className="">
						Terapkan
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default ModalAction;
