// /src/api/goals.js
import axios from 'axios';

const BASE_URL = 'https://cent-stage-assignment.onrender.com/api/goals';

export const getGoals = async () => {
    const res = await axios.get(BASE_URL);
    return res.data;
};
