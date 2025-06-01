import { create } from "zustand";

export const useOrderStore = create((set) => ({
	order: [],
	setOrder: (orderDataOrUpdater) =>
		set((state) => ({
			order:
				typeof orderDataOrUpdater === "function"
					? orderDataOrUpdater(state.order)
					: orderDataOrUpdater,
		})),
}));

export const useFilterStore = create((set) => ({
	filter: {
		activeTab: 0,
		search: "",
		origin: [],
		destination: [],
		page: 1,
		isEnter: false,
		isLoadingPage: false,
		isLoading: true,
		isEndData: false,
	},
	setFilter: (filterDataOrUpdater) =>
		set((state) => ({
			filter:
				typeof filterDataOrUpdater === "function"
					? filterDataOrUpdater(state.filter)
					: filterDataOrUpdater,
		})),
}));
