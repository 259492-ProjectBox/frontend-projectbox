import axios from "axios";

const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	timeout: 3600,
	withCredentials: true,
});

export default axiosInstance;
