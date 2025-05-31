"use client";

import React from "react";

const Layout = () => {
	const menus = [
		{
			label: "Semua Do",
			href: "",
		},
		{
			label: "Sedang Dijadwalkan",
			href: "",
		},
		{
			label: "Terjadwal",
			href: "",
		},
		{
			label: "Dalam Pengiriman",
			href: "",
		},
		{
			label: "Tiba Di Muat",
			href: "",
		},
	];
	return (
		<div className="w-full h-20 flex justify-around items-center shadow-md bg-white">
			{menus.map((val, index) => {
				return (
					<div key={index}>
						<div>{val.label}</div>
					</div>
				);
			})}
		</div>
	);
};

export default Layout;
