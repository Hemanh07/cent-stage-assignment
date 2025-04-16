import '../styles/components.css';
import '../styles/GoalList.css';

// /src/components/GoalList.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectGoal } from '../redux/goalsSlice';

const GoalList = () => {
    const dispatch = useDispatch();
    const { data: goals, selectedGoalId } = useSelector(state => state.goals);

    const handleClick = (goalId) => {
        dispatch(selectGoal(goalId));
    };

    return (
        <ul>
            {goals.map(goal => (
                <li
                    key={goal._id}
                    className={`p-2 rounded cursor-pointer mb-2 border ${selectedGoalId === goal._id ? 'bg-blue-100' : 'bg-gray-100'}`}
                    style={{ borderLeft: `5px solid ${goal.color}` }}
                    onClick={() => handleClick(goal._id)}
                >
                    {goal.name}
                </li>
            ))}
        </ul>
    );
};

export default GoalList;