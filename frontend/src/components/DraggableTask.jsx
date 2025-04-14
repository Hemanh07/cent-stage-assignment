import React from 'react';
import { useDrag } from 'react-dnd';
import './styles/TaskList.css';

const DraggableTask = ({ task, goalColor }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'TASK',
        item: { task, goalColor },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    return (
        <div
            ref={drag}
            className="task-item"
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: 'move',
                borderLeft: `4px solid ${goalColor || '#808080'}`,
                marginBottom: '8px',
                padding: '8px',
                backgroundColor: 'white',
                borderRadius: '4px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
            }}
        >
            {task.name}
        </div>
    );
};

export default DraggableTask;