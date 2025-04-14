import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addEvent, updateEvent, deleteEvent } from '../redux/eventsSlice';
import { v4 as uuidv4 } from 'uuid';
import '../styles/EventModal.css';

const EventModal = ({ isOpen, onClose, event, date, timeSlot }) => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('work');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    useEffect(() => {
        if (event) {
            setTitle(event.title);
            setCategory(event.category || 'work');
            setStartTime(formatTimeForInput(new Date(event.start)));
            setEndTime(formatTimeForInput(new Date(event.end)));
        } else if (timeSlot) {
            // Set default start time to the clicked time slot
            setStartTime(formatTimeForInput(timeSlot));

            // Set default end time to 1 hour after start time
            const defaultEndTime = new Date(timeSlot);
            defaultEndTime.setHours(defaultEndTime.getHours() + 1);
            setEndTime(formatTimeForInput(defaultEndTime));
        }
    }, [event, timeSlot]);

    const formatTimeForInput = (dateTime) => {
        const hours = dateTime.getHours().toString().padStart(2, '0');
        const minutes = dateTime.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const parseTimeInput = (timeString, dateObj) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        const newDate = new Date(dateObj);
        newDate.setHours(hours, minutes, 0, 0);
        return newDate;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert('Please enter a title for the event');
            return;
        }

        const startDateTime = parseTimeInput(startTime, date);
        const endDateTime = parseTimeInput(endTime, date);

        if (startDateTime >= endDateTime) {
            alert('End time must be after start time');
            return;
        }

        const eventData = {
            title,
            category,
            start: startDateTime,
            end: endDateTime
        };

        if (event) {
            // Update existing event
            dispatch(updateEvent({ id: event.id, ...eventData }));
        } else {
            // Create new event
            dispatch(addEvent({ id: uuidv4(), ...eventData }));
        }

        onClose();
    };

    const handleDelete = () => {
        if (event && window.confirm('Are you sure you want to delete this event?')) {
            dispatch(deleteEvent(event.id));
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>{event ? 'Edit Event' : 'Create New Event'}</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            placeholder="Event title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="exercise">Exercise</option>
                            <option value="eating">Eating</option>
                            <option value="work">Work</option>
                            <option value="relax">Relax</option>
                            <option value="family">Family</option>
                            <option value="social">Social</option>
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="start-time">Start Time</label>
                            <input
                                type="time"
                                id="start-time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="end-time">End Time</label>
                            <input
                                type="time"
                                id="end-time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="button-group">
                        {event && (
                            <button
                                type="button"
                                className="delete-button"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        )}
                        <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
                        <button type="submit" className="submit-button">
                            {event ? 'Update Event' : 'Create Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventModal;