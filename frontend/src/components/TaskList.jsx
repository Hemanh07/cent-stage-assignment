import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks } from '../redux/tasksSlice';
import { fetchGoals } from '../redux/goalsSlice';
import DraggableTask from './DraggableTask';
import '../styles/TaskList.css';

const TaskList = ({ goalId }) => {
    const dispatch = useDispatch();
    const { tasks } = useSelector(state => state.tasks);
    const { goals } = useSelector(state => state.goals);

    useEffect(() => {
        dispatch(fetchTasks());
        dispatch(fetchGoals());
    }, [dispatch]);

    // Find the goal that matches the goalId
    const goal = goals.find(g => g.id === goalId);

    // If we have a goal, filter tasks that belong to this goal
    // Otherwise return an empty array
    const goalTasks = goal ? tasks.filter(task => task.goalId === goalId) : [];

    return (
        <div className="task-list">
            <h3 className="task-list-title" style={{ color: goal ? goal.color : '#333' }}>
                {goal ? goal.name : 'Tasks'}
            </h3>

            {goalTasks.length === 0 ? (
                <p className="no-tasks">No tasks available</p>
            ) : (
                <div className="tasks-container">
                    {goalTasks.map(task => (
                        <DraggableTask
                            key={task.id}
                            task={task}
                            goalColor={goal?.color}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TaskList;