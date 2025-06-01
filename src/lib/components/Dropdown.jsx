"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { MdArrowDropDown, MdSearch, MdClear } from "react-icons/md";

const Dropdown = ({
	label = "",
	popupTopPosition = 90,
	popupPosition = "left",
	disabled = false,
	popupZIndexClass = "z-10",
	popupStyle = {},
	btnToggleClass = "",
	placeholder = "Select Value",
	searchPlaceholder = "Search items...",
	items = [],
	onStateChange = () => {},
	type = "single",
	hint = "",
	defaultValue = "",
	maxWidth = "1200px",
	enableSearch = true,
}) => {
	const [multipleSelectedItems, setMultipleSelectedItems] = useState([]);
	const [singleSelectedItem, setSingleSelectedItem] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [filteredItems, setFilteredItems] = useState(items);
	const wrapperRef = useRef(null);
	const searchInputRef = useRef(null);

	// Initialize default values
	useEffect(() => {
		if (type === "single" && defaultValue) {
			const selectedItem = items.find((item) => item.value === defaultValue);
			if (selectedItem) {
				setSingleSelectedItem(selectedItem.label);
			}
		} else if (type === "multi" && Array.isArray(defaultValue)) {
			const selectedItems = items.filter((item) =>
				defaultValue.includes(item.value)
			);
			setMultipleSelectedItems(selectedItems);
		}
	}, [defaultValue, items, type]);

	// Update filtered items when search value or items change
	useEffect(() => {
		if (!enableSearch) {
			setFilteredItems(items);
			return;
		}

		if (!searchValue.trim()) {
			setFilteredItems(items);
		} else {
			const filtered = items.filter((item) =>
				item.label.toLowerCase().includes(searchValue.toLowerCase())
			);
			setFilteredItems(filtered);
		}
	}, [searchValue, items, enableSearch]);

	// Focus search input when dropdown opens
	useEffect(() => {
		if (isOpen && enableSearch && searchInputRef.current) {
			setTimeout(() => {
				searchInputRef.current?.focus();
			}, 100);
		}
	}, [isOpen, enableSearch]);

	// Close the dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
				setIsOpen(false);
				setSearchValue("");
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Handle item selection
	const onSelectItem = useCallback(
		(item) => {
			if (type === "single") {
				setSingleSelectedItem(item.label);
				onStateChange(item.value);
				setIsOpen(false);
				setSearchValue("");
			} else if (type === "multi") {
				const isAlreadySelected = multipleSelectedItems.some(
					(selectedItem) => selectedItem.value === item.value
				);

				const updatedItems = isAlreadySelected
					? multipleSelectedItems.filter(
							(selectedItem) => selectedItem.value !== item.value
					  )
					: [...multipleSelectedItems, item];

				setMultipleSelectedItems(updatedItems);
				onStateChange(updatedItems.map((item) => item.value));
			}
		},
		[multipleSelectedItems, onStateChange, type]
	);

	// Handle search input change
	const handleSearchChange = (e) => {
		setSearchValue(e.target.value);
	};

	// Clear search
	const clearSearch = () => {
		setSearchValue("");
		searchInputRef.current?.focus();
	};

	return (
		<div
			ref={wrapperRef}
			className="relative bg-white border border-black/10 active:border focus:border rounded-lg flex w-full flex-col gap-2"
		>
			{label && <span className="">{label}</span>}
			<button
				disabled={disabled}
				className={`${btnToggleClass} p-2`}
				onClick={(e) => {
					e.stopPropagation();
					setIsOpen(!isOpen);
				}}
			>
				<div className="flex w-full items-center justify-between gap-2">
					<span
						className={`${
							!singleSelectedItem &&
							!multipleSelectedItems.length &&
							!(Array.isArray(defaultValue)
								? defaultValue.length > 0
								: defaultValue)
								? "text-gray-400"
								: "text-gray-700"
						}`}
					>
						{!singleSelectedItem &&
						!multipleSelectedItems.length &&
						!(Array.isArray(defaultValue)
							? defaultValue.length > 0
							: defaultValue)
							? placeholder
							: type === "single"
							? singleSelectedItem
							: `${multipleSelectedItems.length} Selected`}
					</span>

					<span
						style={{
							transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
							transition: "transform 0.15s ease",
						}}
					>
						<MdArrowDropDown />
					</span>
				</div>
			</button>

			{/* Multi-Selected Items Display */}
			{type === "multi" && multipleSelectedItems.length > 0 && (
				<div className="flex flex-wrap gap-2 mb-2 mx-1">
					{multipleSelectedItems.map((item, index) => (
						<div
							key={index}
							className="bg-green-500 text-white rounded-md px-3 py-1 text-sm flex items-center gap-2"
						>
							<span>{item.label}</span>
							<button
								onClick={(e) => {
									e.stopPropagation();
									onSelectItem(item);
								}}
								className="hover:bg-green-600 rounded-full p-1 -mr-1"
							>
								<MdClear size={12} />
							</button>
						</div>
					))}
				</div>
			)}

			{/* Dropdown Items */}
			{isOpen && (
				<div
					className={`absolute h-fit max-h-[300px] w-full min-w-[140px] max-w-[${maxWidth}] overflow-hidden rounded-lg border border-black/10 shadow-lg ${popupZIndexClass} ${
						popupPosition === "right" ? "right-0" : "left-0"
					}`}
					style={{
						top: `44px`,
						...popupStyle,
					}}
				>
					<div className="bg-white relative w-full rounded-lg">
						{/* Search Input */}
						{enableSearch && (
							<div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
								<div className="relative">
									<MdSearch
										className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
										size={16}
									/>
									<input
										ref={searchInputRef}
										type="text"
										value={searchValue}
										onChange={handleSearchChange}
										placeholder={searchPlaceholder}
										className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
									/>
									{searchValue && (
										<button
											onClick={clearSearch}
											className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
										>
											<MdClear size={16} />
										</button>
									)}
								</div>
							</div>
						)}

						{/* Items List */}
						<div className="max-h-[240px] overflow-y-auto">
							<div className="flex h-full flex-col text-gray-700">
								{filteredItems && filteredItems.length ? (
									filteredItems.map((item, index) => {
										const isSelected =
											type === "multi"
												? multipleSelectedItems.some(
														(selectedItem) => selectedItem.value === item.value
												  )
												: singleSelectedItem === item.label;

										return (
											<button
												className={`flex gap-2 p-3 hover:bg-gray-100 text-left ${
													isSelected ? "bg-green-50" : ""
												}`}
												key={index}
												onClick={() => onSelectItem(item)}
											>
												<span className="flex-1">{item.label}</span>
												{isSelected && (
													<span className="text-green-500 font-semibold">
														✓
													</span>
												)}
											</button>
										);
									})
								) : (
									<div className="p-3 text-gray-500 text-center">
										{searchValue ? "No items found" : "No items to select"}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Dropdown;
