import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchEventsApi, createEventApi, updateEventApi, deleteEventApi } from '../api/api';

export const fetchEvents = createAsyncThunk(
    'events/fetchEvents',
    async () => {
        const response = await fetchEventsApi();
        return response;
    }
);

export const addEvent = createAsyncThunk(
    'events/addEvent',
    async (eventData) => {
        const response = await createEventApi(eventData);
        return response;
    }
);

export const updateEvent = createAsyncThunk(
    'events/updateEvent',
    async ({ id, ...eventData }) => {
        const response = await updateEventApi(id, eventData);
        return response;
    }
);

export const deleteEvent = createAsyncThunk(
    'events/deleteEvent',
    async (id) => {
        await deleteEventApi(id);
        return id;
    }
);

export const moveEvent = createAsyncThunk(
    'events/moveEvent',
    async ({ id, start, end }) => {
        const response = await updateEventApi(id, { start, end });
        return response;
    }
);

export const createEventFromTask = createAsyncThunk(
    'events/createEventFromTask',
    async ({ taskName, date, time, goalColor }) => {
        const start = new Date(date);
        start.setHours(time.getHours(), time.getMinutes());

        const end = new Date(start);
        end.setHours(end.getHours() + 1); // Default 1 hour event

        const eventData = {
            title: taskName,
            category: taskName, // Using task name as category for color association
            start,
            end
        };

        const response = await createEventApi(eventData);
        return response;
    }
);

const eventSlice = createSlice({
    name: 'events',
    initialState: {
        events: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch events
            .addCase(fetchEvents.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.events = action.payload;
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // Add event
            .addCase(addEvent.fulfilled, (state, action) => {
                state.events.push(action.payload);
            })

            // Update event
            .addCase(updateEvent.fulfilled, (state, action) => {
                const index = state.events.findIndex(event => event._id === action.payload._id);
                if (index !== -1) {
                    state.events[index] = action.payload;
                }
            })

            // Delete event
            .addCase(deleteEvent.fulfilled, (state, action) => {
                state.events = state.events.filter(event => event._id !== action.payload);
            })

            // Move event
            .addCase(moveEvent.fulfilled, (state, action) => {
                const index = state.events.findIndex(event => event._id === action.payload._id);
                if (index !== -1) {
                    state.events[index] = action.payload;
                }
            })

            // Create event from task
            .addCase(createEventFromTask.fulfilled, (state, action) => {
                state.events.push(action.payload);
            });
    }
});

export default eventSlice.reducer;