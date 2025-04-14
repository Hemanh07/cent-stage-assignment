// /src/api/goals.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/goals';

export const getGoals = async () => {
    const res = await axios.get(BASE_URL);
    return res.data;
};
