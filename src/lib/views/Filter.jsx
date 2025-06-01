"use client";

import React, { useState, useEffect, useCallback } from "react";
import fetchApi from "../api/fetchApi";
import { useOrderStore, useFilterStore } from "../stores";
import TextInput from "../components/TextInput";

import {
	MdList,
	MdSchedule,
	MdEventAvailable,
	MdLocalShipping,
	MdLocationOn,
	MdSearch,
} from "react-icons/md";
import Button from "../components/Button";
import ModalAction from "./ModalAction";
import { destionationOptions, originOptions } from "../const";

const Filter = () => {
	const { order, setOrder } = useOrderStore();
	const { filter, setFilter } = useFilterStore();

	const [openModal, setOpenModal] = useState(false);
	const [menus, setMenus] = useState([
		{ label: "Semua Do", order_status: 0, icon: <MdList /> },
		{ label: "Sedang Dijadwalkan", order_status: 1, icon: <MdSchedule /> },
		{ label: "Terjadwal", order_status: 2, icon: <MdEventAvailable /> },
		{ label: "Dalam Pengiriman", order_status: 3, icon: <MdLocalShipping /> },
		{ label: "Tiba Di Muat", order_status: 4, icon: <MdLocationOn /> },
	]);

	const findLabel = (options, value) => {
		const found = options.find((opt) => opt.value === value);
		return found ? found.label : value;
	};

	const getDatas = useCallback(
		async (
			status = filter.activeTab,
			keyword = filter.search,
			origin_code = filter.origin,
			destination_code = filter.destination,
			page = filter.page
		) => {
			try {
				if (!filter.isEnter) {
					setFilter((prev) => ({
						...prev,
						isLoading: true,
					}));
				}

				const payload = {
					filter: {
						order_status: [status],
						origin_code,
						destination_code,
					},
					keyword,
					page,
				};

				const res = await fetchApi.post("/orders", payload);

				if (res.status === 200) {
					const summary = res.data.summary_do;

					const updatedMenus = menus.map((menu) => {
						const found = summary.find((s) => s.status === menu.order_status);
						return {
							...menu,
							count: found ? found.total : 0,
						};
					});

					setMenus(updatedMenus);

					if (filter.isEnter) {
						if (res.data.order_list.length === 0) {
							setFilter((prev) => ({
								...prev,
								isEndData: true,
							}));
						} else {
							setOrder([...order, ...res.data.order_list]);
						}
					} else {
						setOrder(res.data.order_list);
					}
				}
			} catch (error) {
				console.error("Error fetching DOs:", error);
			} finally {
				setFilter((prev) => ({
					...prev,
					isLoading: false,
					isEnter: false,
					isLoadingPage: false,
				}));
			}
		},
		[filter, menus, setOrder]
	);

	// Handle tab changes
	const handleTabChange = (status) => {
		setFilter((prev) => ({
			...prev,
			activeTab: status,
			search: "",
			origin: [],
			destination: [],
			page: 1,
			isEnter: false,
			isLoadingPage: false,
			isEndData: false,
			isLoading: true,
		}));

		getDatas(status, "", [], [], 1);

		document
			.getElementById("table-wrapper")
			?.scrollTo({ top: 0, behavior: "smooth" });
	};

	// Handle search input changes
	const handleSearchChange = (e) => {
		const newSearchValue = e.target.value;

		setFilter((prev) => ({
			...prev,
			search: newSearchValue,
			isEndData: false,
			page: 1,
		}));

		getDatas(
			filter.activeTab,
			newSearchValue,
			filter.origin,
			filter.destination,
			1
		);
	};

	useEffect(() => {
		if (filter.isEnter) {
			getDatas(
				filter.activeTab,
				filter.search,
				filter.origin,
				filter.destination,
				filter.page
			);
		}
	}, [filter.isEnter]);

	useEffect(() => {
		getDatas();
	}, []);

	return (
		<>
			<ModalAction
				openModal={openModal}
				setOpenModal={setOpenModal}
				getDatas={getDatas}
			/>
			<div className="relative">
				<div className="w-full h-20 flex justify-around items-center border-b bg-white z-50">
					{menus.map((val, index) => {
						const isActive = filter.activeTab === val.order_status;

						return (
							<div
								key={index}
								onClick={() => handleTabChange(val.order_status)}
								className={`px-4 py-2 flex items-center gap-2 rounded-md cursor-pointer transition-all ${
									isActive
										? "bg-green-100 text-green-700 font-semibold"
										: "text-gray-700 hover:bg-gray-100"
								}`}
							>
								<span className="text-xl">{val.icon}</span>
								<span className="text-sm whitespace-nowrap">
									{val.label} {val.count ? `(${val.count})` : ""}
								</span>
							</div>
						);
					})}
				</div>
				<div className="flex px-8 pt-8 gap-4">
					<TextInput
						key={filter.activeTab}
						type="search"
						placeholder="Cari berdasarkan nama barang"
						size="small"
						hasIconLeft={<MdSearch />}
						width="w-[400px]"
						debounceTime={1000}
						value={filter.search}
						onChange={handleSearchChange}
					/>
					<div className="flex gap-4">
						<Button size="small" onClick={() => setOpenModal(true)}>
							Filter
						</Button>
						{filter.origin.length > 0 && (
							<div>
								<div className="flex gap-2 items-center">
									<div>Origin:</div>
									{filter.origin.map((value) => (
										<span
											key={value}
											className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
										>
											{findLabel(originOptions, value)}
										</span>
									))}
								</div>
							</div>
						)}
						{filter.destination.length > 0 && (
							<div>
								<div className="flex gap-2 items-center">
									<div>Destination:</div>
									{filter.destination.map((value) => (
										<span
											key={value}
											className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
										>
											{findLabel(destionationOptions, value)}
										</span>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default Filter;
