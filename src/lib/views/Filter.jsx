"use client";

import React, { useState, useEffect } from "react";
import fetchApi from "../api/fetchApi";
import { useOrderStore, useLoadingStore } from "../stores";
import TextInput from "../components/TextInput";

import {
	MdList,
	MdSchedule,
	MdEventAvailable,
	MdLocalShipping,
	MdLocationOn,
} from "react-icons/md";
import Button from "../components/Button";
import ModalAction from "./ModalAction";

const Filter = () => {
	const { setOrder } = useOrderStore();
	const { setLoading } = useLoadingStore();

	const [activeTab, setActiveTab] = useState(0);
	const [openModal, setOpenModal] = useState(false);
	const [menus, setMenus] = useState([
		{ label: "Semua Do", order_status: 0, icon: <MdList /> },
		{ label: "Sedang Dijadwalkan", order_status: 1, icon: <MdSchedule /> },
		{ label: "Terjadwal", order_status: 2, icon: <MdEventAvailable /> },
		{ label: "Dalam Pengiriman", order_status: 3, icon: <MdLocalShipping /> },
		{ label: "Tiba Di Muat", order_status: 4, icon: <MdLocationOn /> },
	]);

	const getDatas = async (status) => {
		try {
			setLoading(true);
			const res = await fetchApi.post("/orders", {
				keyword: "",
				filter: {
					order_status: [status],
					origin_code: [],
					destination_code: [],
				},
				page: 1,
			});

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
				setOrder(res.data.order_list);
			}
		} catch (error) {
			console.error("Error fetching DOs:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getDatas(activeTab);

		document
			.getElementById("table-wrapper")
			?.scrollTo({ top: 0, behavior: "smooth" });
	}, [activeTab]);

	return (
		<>
			<ModalAction openModal={openModal} setOpenModal={setOpenModal} />
			<div className="relative">
				<div className="w-full h-20 flex justify-around items-center border-b bg-white z-50">
					{menus.map((val, index) => {
						const isActive = activeTab === val.order_status;

						return (
							<div
								key={index}
								onClick={() => setActiveTab(val.order_status)}
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
						type="search"
						placeholder="Cari berdasarkan nama barang"
						size="small"
						width="w-[400px]"
						debounceTime={1000}
					/>
					<Button size="small" onClick={() => setOpenModal(true)}>
						Filter
					</Button>
				</div>
			</div>
		</>
	);
};

export default Filter;
