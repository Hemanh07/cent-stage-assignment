import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TaskItem from './TaskItem';
import { addTask } from '../redux/goalsSlice';
import '../styles/Sidebar.css';

const Sidebar = () => {
    const dispatch = useDispatch();
    const { goals } = useSelector(state => state.goals);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [newTaskName, setNewTaskName] = useState('');

    const handleGoalClick = (goalId) => {
        if (selectedGoal === goalId) {
            setSelectedGoal(null);
        } else {
            setSelectedGoal(goalId);
        }
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if (newTaskName.trim() && selectedGoal) {
            dispatch(addTask({
                goalId: selectedGoal,
                taskName: newTaskName
            }));
            setNewTaskName('');
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebar-section">
                <h3>GOALS</h3>
                <ul className="goal-list">
                    {goals.map(goal => (
                        <li
                            key={goal._id}
                            onClick={() => handleGoalClick(goal._id)}
                            className={selectedGoal === goal._id ? 'selected' : ''}
                            style={{ borderColor: goal.color }}
                        >
                            {goal.name}
                        </li>
                    ))}
                </ul>
            </div>

            {selectedGoal && (
                <div className="sidebar-section">
                    <h3>TASKS</h3>
                    <ul className="task-list">
                        {goals.find(g => g._id === selectedGoal)?.tasks.map(task => (
                            <TaskItem
                                key={task._id}
                                task={task}
                                goalColor={goals.find(g => g._id === selectedGoal).color}
                            />
                        ))}
                    </ul>

                    <form onSubmit={handleAddTask} className="add-task-form">
                        <input
                            type="text"
                            value={newTaskName}
                            onChange={(e) => setNewTaskName(e.target.value)}
                            placeholder="New task..."
                        />
                        <button type="submit">Add</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Sidebar;