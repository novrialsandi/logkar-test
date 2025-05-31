import axios from "axios";

const fetchApi = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_SERVICE_HOST}/api`,
});

fetchApi.interceptors.request.use((config) => {
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

export default fetchApi;
