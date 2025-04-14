import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { updateEvent } from './redux/eventsSlice';

const DraggableEventWrapper = ({ event, children }) => {
    const dispatch = useDispatch();
    const eventRef = useRef(null);

    const [{ isDragging }, drag] = useDrag({
        type: 'EVENT',
        item: () => ({
            id: event.id,
            title: event.title,
            start: event.start,
            end: event.end,
            category: event.category
        }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
                // If we have a valid drop target, update the event with new time/date
                const { date, time } = dropResult;
                if (date && time) {
                    const updatedEvent = {
                        ...event,
                        start: new Date(date.setHours(time.getHours(), time.getMinutes())),
                        end: new Date(date.setHours(time.getHours() + (event.end - event.start) / (60 * 60 * 1000), time.getMinutes()))
                    };
                    dispatch(updateEvent(updatedEvent));
                }
            }
        }
    });

    drag(eventRef);

    return (
        <div
            ref={eventRef}
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: 'move',
            }}
        >
            {children}
        </div>
    );
};

export default DraggableEventWrapper;