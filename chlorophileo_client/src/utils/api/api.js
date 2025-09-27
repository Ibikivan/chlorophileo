import axiosInstance from "../../app/axios/axiosInstance"

export const login = async (data) => {
    const response = await axiosInstance.post('/auth/login', data)
    return response.data
}

export const createUser = async (user) => {
    const response = await axiosInstance.post('/auth/register', user)
    return response.data
}

export const getCurrentUser = async () => {
    const response = await axiosInstance.get('/users/me')
    return response.data
}

export const getAllPlants = async (queries = {}) => {
    const queryParams = Object.assign({}, queries)
    const response = await axiosInstance.get('/plants', { params: queryParams })
    return response.data
}

export const getPlantById = async (id) => {
    const response = await axiosInstance.get(`/plants/${id}`)
    return response.data
}

export const getPlantWaterings = async (plantId) => {
    const response = await axiosInstance.get(`/watering/plant/${plantId}`)
    return response.data
}

export const waterPlant = async (plantId) => {
    const response = await axiosInstance.patch(`/watering/${plantId}/complete`)
    return response.data
}

export const addPlant = async (plant) => {
    const response = await axiosInstance.post('/plants', plant)
    return response.data
}

export const getNotifications = async () => {
    const response = await axiosInstance.get('/notification/pending')
    return response.data
}

export const markNotifsAsRead = async (id) => {
    const response = await axiosInstance.patch(`/notification/${id}/read`)
    return response.data
}
