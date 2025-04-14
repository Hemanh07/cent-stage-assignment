import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createEventApi } from '../api/events';
import { createTaskApi, updateTaskApi } from '../api/tasks';
import { getGoals } from '../api/goals'
export const fetchGoals = createAsyncThunk(
    'goals/fetchGoals',
    async () => {
        const response = await getGoals();
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

export const updateTask = createAsyncThunk(
    'goals/updateTask',
    async ({ goalId, taskId, updates }) => {
        const response = await updateTaskApi(goalId, taskId, updates);
        return { goalId, taskId, updates: response };
    }
);

export const createEventFromTask = createAsyncThunk(
    'tasks/createEventFromTask',
    async ({ taskId, taskName, goalId, goalColor, start, end }) => {
        // Create a new event based on the task
        const eventData = {
            title: taskName,
            category: taskName, // Using task name as the category
            start,
            end,
            taskId, // Reference to the original task
            goalId  // Reference to the goal
        };

        const response = await createEventApi(eventData);

        // Optionally update the task to mark it as added to calendar
        // This depends on your application requirements
        await updateTaskApi(goalId, taskId, { addedToCalendar: true });

        return response;
    }
);

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {
        goals: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch goals and their tasks
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

            // Add a task to a goal
            .addCase(addTask.fulfilled, (state, action) => {
                const { goalId, task } = action.payload;
                const goalIndex = state.goals.findIndex(goal => goal._id === goalId);
                if (goalIndex !== -1) {
                    state.goals[goalIndex].tasks.push(task);
                }
            })

            // Update a task
            .addCase(updateTask.fulfilled, (state, action) => {
                const { goalId, taskId, updates } = action.payload;
                const goalIndex = state.goals.findIndex(goal => goal._id === goalId);
                if (goalIndex !== -1) {
                    const taskIndex = state.goals[goalIndex].tasks.findIndex(task => task._id === taskId);
                    if (taskIndex !== -1) {
                        state.goals[goalIndex].tasks[taskIndex] = {
                            ...state.goals[goalIndex].tasks[taskIndex],
                            ...updates
                        };
                    }
                }
            })

            // Create an event from task - no state update needed here as it affects events state
            .addCase(createEventFromTask.fulfilled, () => {
                // The event will be added to events state via events listener
                // We could update the task status here if needed
            });
    }
});

export default tasksSlice.reducer;