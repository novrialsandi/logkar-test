"use client";

import { useOrderStore, useLoadingStore } from "../stores";
import moment from "moment";
import Filter from "./Filter";

const DosComponent = () => {
	const { order } = useOrderStore();
	const { loading } = useLoadingStore();

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
										className="text-center py-6 p-2 border border-[#cccccc]"
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
												className="p-2 border py-4 border-[#cccccc] text-center"
											>
												{col.key === "updated_at"
													? moment(item[col.key]).format("YYYY-MM-DD HH:mm")
													: item[col.key] ?? "-"}
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
