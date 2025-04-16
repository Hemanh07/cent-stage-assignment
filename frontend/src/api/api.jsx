import axios from 'axios';

const API_BASE_URL = 'https://cent-stage-assignment.onrender.com/api';

// Event API calls
export const fetchEventsApi = async () => {
    const response = await axios.get(`${API_BASE_URL}/events`);
    return response.data;
};

export const createEventApi = async (eventData) => {
    const response = await axios.post(`${API_BASE_URL}/events`, eventData);
    return response.data;
};

export const updateEventApi = async (id, eventData) => {
    const response = await axios.put(`${API_BASE_URL}/events/${id}`, eventData);
    return response.data;
};

export const deleteEventApi = async (id) => {
    await axios.delete(`${API_BASE_URL}/events/${id}`);
    return id;
};

// Goal API calls
export const fetchGoalsApi = async () => {
    const response = await axios.get(`${API_BASE_URL}/goals`);
    return response.data;
};

export const createTaskApi = async (goalId, taskName) => {
    const response = await axios.post(`${API_BASE_URL}/goals/${goalId}/tasks`, { name: taskName });
    return response.data;
};
