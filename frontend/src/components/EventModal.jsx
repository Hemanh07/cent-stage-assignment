import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addEvent, updateEvent, deleteEvent } from '../redux/eventsSlice';
import '../styles/EventModal.css';

const EventModal = ({ isOpen, onClose, event, slotInfo }) => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('work');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const categories = ['exercise', 'eating', 'work', 'relax', 'family', 'social'];

    useEffect(() => {
        if (event) {
            setTitle(event.title);
            setCategory(event.category);
            setStartTime(formatDateToDateTime(new Date(event.start)));
            setEndTime(formatDateToDateTime(new Date(event.end)));
        } else if (slotInfo) {
            setStartTime(formatDateToDateTime(slotInfo.start));
            setEndTime(formatDateToDateTime(slotInfo.end));
        }
    }, [event, slotInfo]);

    const formatDateToDateTime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const eventData = {
            title,
            category,
            start: new Date(startTime),
            end: new Date(endTime)
        };

        if (event) {
            dispatch(updateEvent({ id: event._id, ...eventData }));
        } else {
            dispatch(addEvent(eventData));
        }

        onClose();
    };

    const handleDelete = () => {
        if (event && event._id) {
            dispatch(deleteEvent(event._id));
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{event ? 'Edit Event' : 'Create New Event'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Event title"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="startTime">Start Time</label>
                        <input
                            type="datetime-local"
                            id="startTime"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="endTime">End Time</label>
                        <input
                            type="datetime-local"
                            id="endTime"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                        />
                    </div>

                    <div className="modal-buttons">
                        <button type="button" onClick={onClose}>Cancel</button>
                        {event && <button type="button" className="delete-btn" onClick={handleDelete}>Delete</button>}
                        <button type="submit" className="create-btn">{event ? 'Update' : 'Create'} Event</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventModal;