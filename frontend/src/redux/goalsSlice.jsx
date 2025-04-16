import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGoalsApi, createTaskApi } from '../api/api';

export const fetchGoals = createAsyncThunk(
    'goals/fetchGoals',
    async () => {
        const response = await fetchGoalsApi();
        return response;
    }
);

export const addTask = createAsyncThunk(
    'goals/addTask',
    async ({ goalId, taskName }) => {
        const response = await createTaskApi(goalId, taskName);
        return { goalId, task: response };
    }
);

const goalSlice = createSlice({
    name: 'goals',
    initialState: {
        goals: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch goals
            .addCase(fetchGoals.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchGoals.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.goals = action.payload;
            })
            .addCase(fetchGoals.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // Add task to goal
            .addCase(addTask.fulfilled, (state, action) => {
                const { goalId, task } = action.payload;
                const goalIndex = state.goals.findIndex(goal => goal._id === goalId);
                if (goalIndex !== -1) {
                    state.goals[goalIndex].tasks.push(task);
                }
            });
    }
});

export default goalSlice.reducer;
