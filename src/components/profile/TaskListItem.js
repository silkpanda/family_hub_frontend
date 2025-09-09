import React, { useContext } from 'react';
import { TaskContext } from '../../context/TaskContext';
import { AuthContext } from '../../context/AuthContext';

/**
 * TaskListItem Component
 * Displays a single task, its point value, and its current status with an
 * action button to complete it.
 * @param {object} props
 * @param {object} props.task - The task object to display.
 */
const TaskListItem = ({ task }) => {
    const { completeTask } = useContext(TaskContext);
    const { session } = useContext(AuthContext);
    
    // Check if the currently logged-in user (from AuthContext) is assigned to this task.
    const isAssignedToCurrentUser = task.assignedTo.some(assignee => assignee._id === session.user._id);

    const handleComplete = () => {
        if (isAssignedToCurrentUser) {
            completeTask(task._id);
        } else {
            alert("You can only complete your own assigned tasks.");
        }
    };

    const getStatusPill = () => {
        switch (task.status) {
            case 'pending_approval': 
                return <span className="text-xs font-bold text-yellow-800 bg-yellow-200 px-2 py-1 rounded-full">Pending Approval</span>;
            case 'complete': 
                return <span className="text-xs font-bold text-green-800 bg-green-200 px-2 py-1 rounded-full">Completed!</span>;
            default: 
                return isAssignedToCurrentUser ? (
                    <button onClick={handleComplete} className="bg-green-500 text-white font-bold text-sm py-1 px-3 rounded-lg hover:bg-green-600">
                        Complete
                    </button>
                ) : null;
        }
    };

    return (
        <li className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
                <p className="font-medium text-gray-900">{task.title}</p>
                <p className="text-sm text-yellow-600 font-semibold">{task.points} points</p>
            </div>
            {getStatusPill()}
        </li>
    );
};

export default TaskListItem;
