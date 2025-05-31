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

export const useLoadingStore = create((set) => ({
	loading: true,
	setLoading: (loadingDataOrUpdater) =>
		set((state) => ({
			loading:
				typeof loadingDataOrUpdater === "function"
					? loadingDataOrUpdater(state.loading)
					: loadingDataOrUpdater,
		})),
}));
