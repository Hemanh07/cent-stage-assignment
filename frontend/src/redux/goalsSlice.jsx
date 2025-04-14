import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create an axios instance with the base URL pointing to your backend
const api = axios.create({
    baseURL: 'http://localhost:5000'
});

export const fetchGoals = createAsyncThunk(
    'goals/fetchGoals',
    async () => {
        const response = await api.get('/api/goals');
        return response.data;
    }
);

export const addGoal = createAsyncThunk(
    'goals/addGoal',
    async (goal) => {
        const response = await api.post('/api/goals', goal);
        return response.data;
    }
);

export const updateGoal = createAsyncThunk(
    'goals/updateGoal',
    async (goal) => {
        const response = await api.put(`/api/goals/${goal.id}`, goal);
        return response.data;
    }
);

export const deleteGoal = createAsyncThunk(
    'goals/deleteGoal',
    async (id) => {
        await api.delete(`/api/goals/${id}`);
        return id;
    }
);

// Task-related thunks
export const addTask = createAsyncThunk(
    'goals/addTask',
    async (task) => {
        const response = await api.post(`/api/goals/${task.goalId}/tasks`, task);
        return response.data;
    }
);

export const updateTask = createAsyncThunk(
    'goals/updateTask',
    async (task) => {
        const response = await api.put(`/api/goals/${task.goalId}/tasks/${task.id}`, task);
        return response.data;
    }
);

export const deleteTask = createAsyncThunk(
    'goals/deleteTask',
    async ({ taskId, goalId }) => {
        await api.delete(`/api/goals/${goalId}/tasks/${taskId}`);
        return { taskId, goalId };
    }
);

const goalsSlice = createSlice({
    name: 'goals',
    initialState: {
        goals: [
            {
                id: '1',
                name: 'Be fit',
                color: '#FF5733',
                tasks: [
                    { id: '101', name: 'AI-based agents', goalId: '1' },
                    { id: '102', name: 'MLE', goalId: '1' }
                ]
            },
            {
                id: '2',
                name: 'Academics',
                color: '#33FF57',
                tasks: [
                    { id: '201', name: 'DE related', goalId: '2' },
                    { id: '202', name: 'Basics', goalId: '2' }
                ]
            },
            {
                id: '3',
                name: 'LEARN',
                color: '#A033FF',
                tasks: []
            },
            {
                id: '4',
                name: 'Spanish',
                color: '#33A0FF',
                tasks: []
            }
        ],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch goals
            .addCase(fetchGoals.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGoals.fulfilled, (state, action) => {
                if (action.payload && action.payload.length > 0) {
                    state.goals = action.payload;
                }
                // If the API doesn't return goals, we'll keep the initial state
                state.loading = false;
            })
            .addCase(fetchGoals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Add goal
            .addCase(addGoal.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addGoal.fulfilled, (state, action) => {
                state.goals.push(action.payload);
                state.loading = false;
            })
            .addCase(addGoal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Update goal
            .addCase(updateGoal.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateGoal.fulfilled, (state, action) => {
                const index = state.goals.findIndex(goal => goal.id === action.payload.id);
                if (index !== -1) {
                    state.goals[index] = action.payload;
                }
                state.loading = false;
            })
            .addCase(updateGoal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Delete goal
            .addCase(deleteGoal.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteGoal.fulfilled, (state, action) => {
                state.goals = state.goals.filter(goal => goal.id !== action.payload);
                state.loading = false;
            })
            .addCase(deleteGoal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Add task
            .addCase(addTask.fulfilled, (state, action) => {
                const { goalId } = action.payload;
                const goalIndex = state.goals.findIndex(goal => goal.id === goalId);

                if (goalIndex !== -1) {
                    // Add the new task to the goal's tasks array
                    if (!state.goals[goalIndex].tasks) {
                        state.goals[goalIndex].tasks = [];
                    }
                    state.goals[goalIndex].tasks.push(action.payload);
                }
            })

            // Update task
            .addCase(updateTask.fulfilled, (state, action) => {
                const { id, goalId } = action.payload;
                const goalIndex = state.goals.findIndex(goal => goal.id === goalId);

                if (goalIndex !== -1 && state.goals[goalIndex].tasks) {
                    const taskIndex = state.goals[goalIndex].tasks.findIndex(task => task.id === id);

                    if (taskIndex !== -1) {
                        state.goals[goalIndex].tasks[taskIndex] = action.payload;
                    }
                }
            })

            // Delete task
            .addCase(deleteTask.fulfilled, (state, action) => {
                const { taskId, goalId } = action.payload;
                const goalIndex = state.goals.findIndex(goal => goal.id === goalId);

                if (goalIndex !== -1 && state.goals[goalIndex].tasks) {
                    state.goals[goalIndex].tasks = state.goals[goalIndex].tasks.filter(
                        task => task.id !== taskId
                    );
                }
            });
    }
});

export default goalsSlice.reducer;