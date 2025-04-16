import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import EventModal from './EventModal';
import { moveEvent } from '../redux/eventsSlice';
import '../styles/Calendar.css';

const localizer = momentLocalizer(moment);

const Calendar = () => {
    const dispatch = useDispatch();
    const { events } = useSelector(state => state.events);
    const { goals } = useSelector(state => state.goals);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const handleSelectSlot = slot => {
        setSelectedEvent(null);
        setSelectedSlot({
            start: slot.start,
            end: slot.end
        });
        setIsModalOpen(true);
    };

    const handleSelectEvent = event => {
        setSelectedEvent(event);
        setSelectedSlot(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
        setSelectedSlot(null);
    };

    const handleEventDrop = ({ event, start, end }) => {
        dispatch(moveEvent({
            id: event._id,
            start,
            end
        }));
    };

    // Map events to the format expected by react-big-calendar
    const calendarEvents = events.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
        // Set color based on category
        style: {
            backgroundColor: getCategoryColor(event.category, goals)
        }
    }));

    return (
        <div className="calendar-container">
            <BigCalendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                selectable
                resizable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                onEventDrop={handleEventDrop}
                views={['month', 'week', 'day']}
                defaultView='week'
                step={15}
                timeslots={4}
                eventPropGetter={(event) => ({
                    style: event.style
                })}
            />

            {isModalOpen && (
                <EventModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    event={selectedEvent}
                    slotInfo={selectedSlot}
                />
            )}
        </div>
    );
};

// Helper function to get color based on category or task
const getCategoryColor = (category, goals) => {
    const categoryColors = {
        exercise: '#FF5733',
        eating: '#33FF57',
        work: '#3357FF',
        relax: '#F3FF33',
        family: '#FF33F6',
        social: '#33FFF6'
    };

    // For events created from tasks, find the corresponding goal color
    if (!categoryColors[category]) {
        const relatedGoal = goals.find(goal =>
            goal.tasks.some(task => task.name === category)
        );
        return relatedGoal ? relatedGoal.color : '#808080';
    }

    return categoryColors[category];
};

export default Calendar;