// /src/components/DraggableTask.js
import React from 'react';

const DraggableTask = ({ task, color }) => {
    const handleDragStart = (e) => {
        e.dataTransfer.setData('task', JSON.stringify(task));
    };

    return (
        <li
            draggable
            onDragStart={handleDragStart}
            className="p-2 rounded mb-2 bg-white shadow cursor-grab"
            style={{ borderLeft: `5px solid ${color}` }}
        >
            {task.name}
        </li>
    );
};

export default DraggableTask;
