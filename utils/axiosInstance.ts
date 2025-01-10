import axios from "axios";

const axiosInstance = axios.create({
	baseURL: process.env.AUTHSERVICE_URL,
	timeout: 10000,
	withCredentials: true,
});

export default axiosInstance;
