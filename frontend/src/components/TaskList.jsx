// /src/components/TaskList.js
import React from 'react';
import { useSelector } from 'react-redux';
import DraggableTask from './DraggableTask';

const TaskList = () => {
    const { data: tasks } = useSelector(state => state.tasks);
    const { data: goals, selectedGoalId } = useSelector(state => state.goals);

    const selectedGoalTasks = tasks.filter(task => task.goalId === selectedGoalId);
    const goalColor = goals.find(g => g._id === selectedGoalId)?.color || '#ccc';

    return (
        <ul>
            {selectedGoalTasks.map(task => (
                <DraggableTask key={task._id} task={task} color={goalColor} />
            ))}
        </ul>
    );
};

export default TaskList;
