import React from 'react';
import { useDispatch } from 'react-redux';
import { useDrag } from 'react-dnd';
import { createEventFromTask } from '../redux/eventsSlice';
import '../styles/TaskItem.css';

const TaskItem = ({ task, goalColor }) => {
    const dispatch = useDispatch();

    const [{ isDragging }, drag] = useDrag({
        type: 'TASK',
        item: { id: task._id, name: task.name },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        // Here we would create an event, but for now let's just log
        console.log('Task dropped on calendar:', task.name);
    };

    return (
        <li
            ref={drag}
            className={`task-item ${isDragging ? 'dragging' : ''}`}
            style={{ backgroundColor: goalColor + '30' }}
        >
            {task.name}
        </li>
    );
};

export default TaskItem;