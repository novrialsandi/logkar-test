"use client";

import { useOrderStore, useFilterStore } from "../stores";
import moment from "moment";
import Filter from "./Filter";
import { MdMoreVert } from "react-icons/md";
import Tippy from "@tippyjs/react";
import { useState, useRef, useEffect } from "react";
import "tippy.js/dist/tippy.css";
import { columns } from "../const/tableColumns";
import "tippy.js/themes/light.css";

const DosComponent = () => {
	const { order } = useOrderStore();
	const { filter, setFilter } = useFilterStore();
	const [activeMenuRowIndex, setActiveMenuRowIndex] = useState(null);
	const tableWrapperRef = useRef(null);

	const handleScroll = (e) => {
		const { scrollTop, scrollHeight, clientHeight } = e.target;

		if (
			scrollTop + clientHeight >= scrollHeight - 50 &&
			!filter.isLoadingPage &&
			!filter.isLoading &&
			!filter.isEndData
		) {
			setFilter((prev) => ({
				...prev,
				isEnter: true,
				isLoadingPage: true,
				page: prev.page + 1,
			}));
		}
	};

	useEffect(() => {
		if (filter.isLoadingPage && tableWrapperRef.current) {
			const wrapper = tableWrapperRef.current;
			wrapper.scrollTo({ top: wrapper.scrollHeight, behavior: "smooth" });
		}
	}, [filter.isLoadingPage]);

	return (
		<div className="w-full  p-20">
			<div className="border">
				<Filter />
				<div
					id="table-wrapper"
					ref={tableWrapperRef}
					className="m-8 overflow-y-auto h-[600px]"
					onScroll={handleScroll}
				>
					<table className="w-full relative  border-collapse border border-[#cccccc] text-sm">
						<thead className="sticky top-0 z-0   bg-white">
							<tr className="bg-gray-100 ">
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
							{filter.isLoading ? (
								<tr>
									<td
										colSpan={columns.length}
										className="text-center py-4 text-gray-500"
									>
										<div className="flex justify-center items-center">
											<div className="w-6 h-6 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
										</div>
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
													theme="light"
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
																theme="light"
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
							{filter.isLoadingPage && (
								<tr>
									<td
										colSpan={columns.length}
										className="text-center py-4 text-gray-500"
									>
										<div className="flex justify-center items-center">
											<div className="w-6 h-6 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
										</div>
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
