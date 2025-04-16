import { configureStore } from '@reduxjs/toolkit';
import eventReducer from './eventsSlice';
import goalReducer from './goalsSlice';

export default configureStore({
    reducer: {
        events: eventReducer,
        goals: goalReducer
    }
});
