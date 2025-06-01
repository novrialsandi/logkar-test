import React, { useState } from "react";
import Modal from "../components/Modal";
import Dropdown from "../components/Dropdown";
import Button from "../components/Button";
import { useFilterStore } from "../stores";
import { destionationOptions, originOptions } from "../const/tableColumns";

const ModalAction = ({ openModal, setOpenModal, getDatas }) => {
	const [activeTab, setActiveTab] = useState("origin");
	const { filter, setFilter } = useFilterStore();

	const [temp, setTemp] = useState({
		originTemporary: [],
		destinationTemporary: [],
	});

	const findLabel = (options, value) => {
		const found = options.find((opt) => opt.value === value);
		return found ? found.label : value;
	};

	const handleReset = () => {
		setTemp({
			originTemporary: [],
			destinationTemporary: [],
		});
		// setFilter((prev) => ({ ...prev, origin: [], destination: [] }));
	};

	const handleApply = () => {
		setFilter((prev) => ({
			...prev,
			origin: temp.originTemporary,
			destination: temp.destinationTemporary,
			isEndData: false,

			page: 1,
		}));
		getDatas(
			filter.activeTab,
			filter.search,
			filter.origin,
			filter.destination,
			1
		);
		setOpenModal(false);
	};

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
						<div className="w-full" key={activeTab}>
							<Dropdown
								type="multi"
								items={originOptions}
								defaultValue={
									filter.origin.length > 0
										? filter.origin
										: temp.originTemporary
								}
								onStateChange={(e) =>
									setTemp((prev) => ({ ...prev, originTemporary: e }))
								}
							/>
						</div>
					) : (
						<div className="w-full" key={activeTab}>
							<Dropdown
								type="multi"
								items={destionationOptions}
								defaultValue={
									filter.destination.length > 0
										? filter.destination
										: temp.destinationTemporary
								}
								onStateChange={(e) =>
									setTemp((prev) => ({ ...prev, destinationTemporary: e }))
								}
							/>
						</div>
					)}
				</div>

				<div className="space-y-4">
					<div className="mt-4">
						<h4 className="font-semibold mb-2">Selected Origin</h4>
						<div className="flex flex-wrap gap-2 mb-4">
							{temp.originTemporary.length > 0 ? (
								temp.originTemporary.map((value) => (
									<span
										key={value}
										className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
									>
										{findLabel(originOptions, value)}
									</span>
								))
							) : (
								<span className="text-gray-400 italic text-sm">
									No origin selected
								</span>
							)}
						</div>

						<h4 className="font-semibold mb-2">Selected Destination</h4>
						<div className="flex flex-wrap gap-2">
							{temp.destinationTemporary.length > 0 ? (
								temp.destinationTemporary.map((value) => (
									<span
										key={value}
										className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
									>
										{findLabel(destionationOptions, value)}
									</span>
								))
							) : (
								<span className="text-gray-400 italic text-sm">
									No destination selected
								</span>
							)}
						</div>
					</div>

					{/* Action Buttons */}
					<div className="border-t flex justify-end gap-4 p-2">
						<button
							className="text-gray-500 hover:underline"
							onClick={handleReset}
						>
							Reset
						</button>
						<Button size="small" onClick={handleApply}>
							Terapkan
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ModalAction;
