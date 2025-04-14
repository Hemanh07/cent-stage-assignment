import React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Calendar from './components/Calendar';
import Sidebar from './components/Sidebar';
import { fetchEvents } from './redux/eventsSlice';
import { fetchGoals } from './redux/goalsSlice';
import './App.css';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchGoals());
  }, [dispatch]);

  return (
    <div className="app">
      <h1>Calendar App</h1>
      <div className="app-container">
        <Sidebar />
        <Calendar />
      </div>
    </div>
  );
}

export default App;