import React from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { moveEvent } from './redux/eventsSlice';
import moment from 'moment';

const DroppableDateCellWrapper = ({ children, value }) => {
    const dispatch = useDispatch();

    const [{ isOver }, drop] = useDrop({
        accept: 'EVENT',
        drop: (item, monitor) => {
            const { event } = item;

            // Calculate the new start and end dates
            const dropDate = value;
            const originalStart = moment(event.start);
            const originalEnd = moment(event.end);
            const duration = moment.duration(originalEnd.diff(originalStart));

            // Keep the same time, just change the date
            const newStart = moment(dropDate)
                .hours(originalStart.hours())
                .minutes(originalStart.minutes())
                .seconds(0)
                .milliseconds(0);

            // Add the original duration to the new start time
            const newEnd = moment(newStart).add(duration);

            // Dispatch the move event action
            dispatch(moveEvent({
                id: event._id || event.id,
                start: newStart.toDate(),
                end: newEnd.toDate()
            }));
        },
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    });

    const backgroundColor = isOver ? 'rgba(0, 120, 255, 0.1)' : '';

    return (
        <div ref={drop} style={{ height: '100%', backgroundColor }}>
            {children}
        </div>
    );
};

export default DroppableDateCellWrapper;