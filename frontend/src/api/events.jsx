// /src/api/events.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/events';

export const getEvents = async () => {
    const res = await axios.get(BASE_URL);
    return res.data;
};

export const addEvent = async (event) => {
    const res = await axios.post(BASE_URL, event);
    return res.data;
};

export const updateEvent = async (event) => {
    const res = await axios.put(`${BASE_URL}/${event._id}`, event);
    return res.data;
};

export const deleteEvent = async (id) => {
    await axios.delete(`${BASE_URL}/${id}`);
};
