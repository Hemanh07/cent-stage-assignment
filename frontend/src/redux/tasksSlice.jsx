// /src/redux/tasksSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTasks } from '../api/tasks';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
    return await getTasks();
});

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {
        data: [],
        status: 'idle',
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchTasks.pending, state => {
                state.status = 'loading';
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchTasks.rejected, state => {
                state.status = 'failed';
            });
    },
});

export default tasksSlice.reducer;
