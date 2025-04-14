import axios from 'axios';

const API_BASE_URL = '/api';

export const fetchTasksApi = async (goalId) => {
    const response = await axios.get(`${API_BASE_URL}/goals/${goalId}/tasks`);
    return response.data;
};

export const createTaskApi = async (goalId, taskName) => {
    const response = await axios.post(`${API_BASE_URL}/goals/${goalId}/tasks`, {
        name: taskName,
        completed: false
    });
    return response.data;
};

export const updateTaskApi = async (goalId, taskId, updates) => {
    const response = await axios.put(`${API_BASE_URL}/goals/${goalId}/tasks/${taskId}`, updates);
    return response.data;
};

export const deleteTaskApi = async (goalId, taskId) => {
    const response = await axios.delete(`${API_BASE_URL}/goals/${goalId}/tasks/${taskId}`);
    return response.data;
};