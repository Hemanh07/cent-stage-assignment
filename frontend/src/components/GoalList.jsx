import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import TaskList from './TaskList';
import '../styles/GoalList.css';

const GoalList = () => {
    const { goals } = useSelector(state => state.goals);
    const [expandedGoal, setExpandedGoal] = useState(null);

    const toggleGoal = (goalId) => {
        if (expandedGoal === goalId) {
            setExpandedGoal(null);
        } else {
            setExpandedGoal(goalId);
        }
    };

    return (
        <div className="goal-list-container">
            <h3>GOALS</h3>
            <ul className="goal-list">
                {goals.map(goal => (
                    <li key={goal._id}>
                        <div
                            className={`goal-item ${expandedGoal === goal._id ? 'expanded' : ''}`}
                            onClick={() => toggleGoal(goal._id)}
                            style={{ borderLeft: `4px solid ${goal.color}` }}
                        >
                            {goal.name}
                        </div>
                        {expandedGoal === goal._id && (
                            <TaskList goalId={goal._id} />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GoalList;
