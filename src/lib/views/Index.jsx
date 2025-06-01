"use client";

import { useOrderStore, useLoadingStore } from "../stores";
import moment from "moment";
import Filter from "./Filter";
import { MdMoreVert } from "react-icons/md";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // Optional: default styling
import { useState } from "react";

const DosComponent = () => {
	const { order } = useOrderStore();
	const { loading } = useLoadingStore();
	const [activeMenuRowIndex, setActiveMenuRowIndex] = useState(null);

	const columns = [
		{ label: "Do/No", key: "do_no" },
		{ label: "Do/Id", key: "do_id" },
		{ label: "Goods", key: "goods_name" },
		{ label: "Quantity", key: "goods_qty" },
		{ label: "Unit", key: "goods_unit" },
		{ label: "Goods in Ton", key: "goods_qty_ton" },
		{ label: "Order Type", key: "order_type" },
		{ label: "Order Type Name", key: "order_type_name" },
		{ label: "Origin", key: "origin_name" },
		{ label: "Destination", key: "destination_name" },
		{ label: "Destination Address", key: "destination_address" },
		{ label: "Status", key: "status" },
		{ label: "Referensi", key: "ref_no" },
		{ label: "Updated Date", key: "updated_at" },
		{ label: "", key: "" },
	];

	return (
		<div className="w-full  p-20">
			<div className="border">
				<Filter />
				<div className="p-8 overflow-x-auto">
					<table className="w-full border-collapse border border-[#cccccc] text-sm">
						<thead>
							<tr className="bg-gray-100">
								{columns.map((col) => (
									<th
										key={col.key}
										className="text-center py-6 p-2 text-ellipsis text-nowrap border border-[#cccccc]"
									>
										{col.label}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr>
									<td
										colSpan={columns.length}
										className="text-center py-10 text-gray-500"
									>
										Loading data...
									</td>
								</tr>
							) : order.length > 0 ? (
								order.map((item, rowIndex) => (
									<tr key={rowIndex} className="hover:bg-gray-50">
										{columns.map((col) => (
											<td
												key={col.key}
												className="p-2 border text-ellipsis text-nowrap py-4 border-[#cccccc] text-center max-w-[200px] overflow-hidden"
											>
												{/* Tippy untuk tooltip umum */}
												<Tippy
													content={
														col.key === "updated_at"
															? moment(item[col.key]).format("YYYY-MM-DD HH:mm")
															: col.key === ""
															? "Kelola"
															: item[col.key] ?? "-"
													}
													disabled={col.key === ""}
												>
													<span>
														{col.key === "updated_at" ? (
															moment(item[col.key]).format("YYYY-MM-DD HH:mm")
														) : col.key === "" ? (
															<Tippy
																visible={activeMenuRowIndex === rowIndex}
																interactive={true}
																placement="bottom-end"
																onClickOutside={() =>
																	setActiveMenuRowIndex(null)
																}
																content={
																	<div className="bg-white rounded-sm text-sm text-left">
																		<button
																			onClick={() => {
																				setActiveMenuRowIndex(null);
																			}}
																			className="block w-full px-4 py-2 rounded-sm hover:bg-red-100 text-red-600"
																		>
																			Hapus
																		</button>
																	</div>
																}
															>
																<button
																	className="cursor-pointer"
																	onClick={() =>
																		setActiveMenuRowIndex(
																			activeMenuRowIndex === rowIndex
																				? null
																				: rowIndex
																		)
																	}
																>
																	<MdMoreVert size={24} />
																</button>
															</Tippy>
														) : (
															item[col.key] ?? "-"
														)}
													</span>
												</Tippy>
											</td>
										))}
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={columns.length}
										className="text-center py-10 text-gray-400"
									>
										Tidak ada data ditemukan.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default DosComponent;
