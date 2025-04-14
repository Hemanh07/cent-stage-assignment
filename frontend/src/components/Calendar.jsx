import React, { useState, useCallback, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { moveEvent, fetchEvents, addEvent } from '../redux/eventsSlice';
import { fetchGoals } from '../redux/goalsSlice';
import EventModal from './EventModal';
import DraggableEventWrapper from '../DraggableEventWrapper';
import DroppableDateCellWrapper from '../DroppableDateCellWrapper';
import '../styles/Calendar.css';

const localizer = momentLocalizer(moment);

const Calendar = () => {
    const dispatch = useDispatch();
    const { events } = useSelector(state => state.events);
    const { goals } = useSelector(state => state.goals);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);

    // Fetch events and goals on component mount
    useEffect(() => {
        dispatch(fetchEvents());
        dispatch(fetchGoals());
    }, [dispatch]);

    // Helper function to get color based on category or associated goal
    const getEventStyle = useCallback((event) => {
        const categoryColors = {
            exercise: '#FF5733',
            eating: '#33FF57',
            work: '#3357FF',
            relax: '#F3FF33',
            family: '#FF33F6',
            social: '#33FFF6'
        };

        // Check if the event has a predefined category color
        if (categoryColors[event.category]) {
            return {
                backgroundColor: categoryColors[event.category],
                color: '#FFF',
                borderRadius: '4px'
            };
        }

        // For events created from tasks, find the corresponding goal color
        const relatedGoal = goals.find(goal =>
            goal.tasks?.some(task => task.name === event.title)
        );

        return {
            backgroundColor: relatedGoal ? relatedGoal.color : '#808080',
            color: '#FFF',
            borderRadius: '4px'
        };
    }, [goals]);

    const handleSelectSlot = useCallback((slotInfo) => {
        setSelectedEvent(null);
        setSelectedSlot({
            start: slotInfo.start,
            end: slotInfo.end
        });
        setIsModalOpen(true);
    }, []);

    const handleSelectEvent = useCallback((event) => {
        setSelectedEvent(event);
        setSelectedSlot(null);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedEvent(null);
        setSelectedSlot(null);
    }, []);

    const handleEventDrop = useCallback(({ event, start, end }) => {
        dispatch(moveEvent({
            id: event._id || event.id,
            start,
            end
        }));
    }, [dispatch]);

    const handleEventResize = useCallback(({ event, start, end }) => {
        dispatch(moveEvent({
            id: event._id || event.id,
            start,
            end
        }));
    }, [dispatch]);

    // This function handles dropping a task onto the calendar
    const handleTaskDrop = (item, date) => {
        const { task, goalColor } = item;
        const start = date;
        // Default duration is 1 hour
        const end = new Date(date.getTime() + 60 * 60 * 1000);

        dispatch(addEvent({
            title: task.name,
            start,
            end,
            goalId: task.goalId,
            color: goalColor || '#808080'
        }));
    };

    // Format events for the calendar
    const calendarEvents = events.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
    }));

    // Custom components for drag and drop
    const components = {
        eventWrapper: props => <DraggableEventWrapper {...props} />,
        dateCellWrapper: props => (
            <DroppableDateCellWrapper
                {...props}
                onTaskDrop={handleTaskDrop}
            />
        )
    };

    return (
        <DndProvider backend={HTML5Backend}>
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
                    onEventResize={handleEventResize}
                    views={['month', 'week', 'day']}
                    defaultView='week'
                    step={15}
                    timeslots={4}
                    components={components}
                    eventPropGetter={(event) => ({
                        style: getEventStyle(event)
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
        </DndProvider>
    );
};

export default Calendar;