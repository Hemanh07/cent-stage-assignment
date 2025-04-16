// /src/api/tasks.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/tasks';

export const getTasks = async () => {
    const res = await axios.get(BASE_URL);
    return res.data;
};
