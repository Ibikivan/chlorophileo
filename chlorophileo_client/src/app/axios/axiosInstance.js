import axios from "axios"

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const token = sessionStorage.getItem('accessToken')

const axiosInstance = axios.create({
    baseURL: baseURL,
})

axiosInstance.interceptors.request.use((config) => {
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
})

export default axiosInstance
