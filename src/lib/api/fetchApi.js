import axios from "axios";

const fetchApi = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_SERVICE_HOST}/api`,
});

export default fetchApi;
