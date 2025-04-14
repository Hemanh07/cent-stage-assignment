import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/events';

// API functions for events
export const fetchEventsApi = async () => {
    try {
        const response = await axios.get(BASE_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
};

export const createEventApi = async (eventData) => {
    try {
        const response = await axios.post(BASE_URL, eventData);
        return response.data;
    } catch (error) {
        console.error('Error creating event:', error);
        throw error;
    }
};

export const updateEventApi = async (id, eventData) => {
    try {
        const response = await axios.put(`${BASE_URL}/${id}`, eventData);
        return response.data;
    } catch (error) {
        console.error('Error updating event:', error);
        throw error;
    }
};

export const deleteEventApi = async (id) => {
    try {
        await axios.delete(`${BASE_URL}/${id}`);
        return id;
    } catch (error) {
        console.error('Error deleting event:', error);
        throw error;
    }
};

// Function to create an event from a task (for drag and drop functionality)
export const createEventFromTaskApi = async (taskData) => {
    try {
        const { taskId, goalId, start, end } = taskData;
        const response = await axios.post(`${BASE_URL}/from-task`, {
            taskId,
            goalId,
            start,
            end
        });
        return response.data;
    } catch (error) {
        console.error('Error creating event from task:', error);
        throw error;
    }
};