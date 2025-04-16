// /src/api/tasks.js
import axios from 'axios';

const BASE_URL = 'https://cent-stage-assignment.onrender.com/api/tasks';

export const getTasks = async () => {
    const res = await axios.get(BASE_URL);
    return res.data;
};
