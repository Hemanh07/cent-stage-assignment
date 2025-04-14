import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './eventsSlice';
import goalsReducer from './goalsSlice';
import tasksReducer from './tasksSlice';

export const store = configureStore({
    reducer: {
        events: eventsReducer,
        goals: goalsReducer,
        tasks: tasksReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['events/addEvent/fulfilled', 'events/updateEvent/fulfilled'],
                // Ignore these field paths in all actions
                ignoredActionPaths: ['meta.arg', 'payload.start', 'payload.end'],
                // Ignore these paths in the state
                ignoredPaths: ['events.events'],
            },
        }),
});

export default store;