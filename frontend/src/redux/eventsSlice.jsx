import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:5000'
});

// Async thunk for fetching events
export const fetchEvents = createAsyncThunk(
    'events/fetchEvents',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/api/events');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async thunk for adding an event
export const addEvent = createAsyncThunk(
    'events/addEvent',
    async (eventData, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/events', {
                title: eventData.title,
                category: eventData.category,
                startTime: eventData.start,
                endTime: eventData.end,
                color: eventData.color
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async thunk for creating an event from a task
export const createEventFromTask = createAsyncThunk(
    'events/createEventFromTask',
    async (taskData, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/events/from-task', {
                taskId: taskData.id || taskData._id,
                title: taskData.title,
                category: taskData.category || 'work',
                startTime: taskData.scheduledDate || taskData.dueDate,
                duration: taskData.estimatedTime || 60 // default 60 minutes if not specified
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async thunk for updating an event
export const updateEvent = createAsyncThunk(
    'events/updateEvent',
    async ({ id, ...eventData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/api/events/${id}`, {
                title: eventData.title,
                category: eventData.category,
                startTime: eventData.start,
                endTime: eventData.end,
                color: eventData.color
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async thunk for deleting an event
export const deleteEvent = createAsyncThunk(
    'events/deleteEvent',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/api/events/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const eventsSlice = createSlice({
    name: 'events',
    initialState: {
        events: [],
        loading: false,
        error: null
    },
    reducers: {
        // For optimistic updates
        moveEvent: (state, action) => {
            const { id, start, end } = action.payload;
            const eventIndex = state.events.findIndex(
                event => (event._id && event._id === id) || (event.id && event.id === id)
            );

            if (eventIndex !== -1) {
                state.events[eventIndex].start = start;
                state.events[eventIndex].end = end;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch events
            .addCase(fetchEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.events = action.payload;
                state.loading = false;
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add event
            .addCase(addEvent.fulfilled, (state, action) => {
                state.events.push(action.payload);
            })
            // Create event from task
            .addCase(createEventFromTask.fulfilled, (state, action) => {
                state.events.push(action.payload);
            })
            // Update event
            .addCase(updateEvent.fulfilled, (state, action) => {
                const updatedEvent = action.payload;
                const index = state.events.findIndex(
                    event => (event._id && event._id === updatedEvent._id) ||
                        (event.id && event.id === updatedEvent.id)
                );

                if (index !== -1) {
                    state.events[index] = updatedEvent;
                }
            })
            // Delete event
            .addCase(deleteEvent.fulfilled, (state, action) => {
                const id = action.payload;
                state.events = state.events.filter(
                    event => (event._id !== id) && (event.id !== id)
                );
            });
    }
});

export const { moveEvent } = eventsSlice.actions;
export default eventsSlice.reducer;

// Middleware to connect the moveEvent action with the updateEvent thunk
export const eventMiddleware = store => next => action => {
    const result = next(action);

    if (action.type === 'events/moveEvent') {
        store.dispatch(updateEvent(action.payload));
    }

    return result;
};