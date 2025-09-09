import React, { useContext, useMemo, useState } from 'react';
import { TaskContext } from '../../context/TaskContext';
import { HouseholdContext } from '../../context/HouseholdContext';

/**
 * A component to display and manage one-off chores.
 */
const ChoresManager = ({ onEdit, onDelete }) => {
    const { tasks, loading } = useContext(TaskContext);
    const { householdData } = useContext(HouseholdContext);
    const [showCompleted, setShowCompleted] = useState(false);

    const memberMap = useMemo(() => {
        if (!householdData?.household?.members) return new Map();
        return new Map(householdData.household.members.map(member => [member.user._id, member.user.displayName]));
    }, [householdData]);
    
    const getAssignedNames = (assignedToIds = []) => {
        const names = assignedToIds
            .map(id => memberMap.get(id))
            .filter(Boolean)
            .join(', ');
        return names || 'None';
    };

    const { activeChores, completedChores } = useMemo(() => {
        const chores = tasks.filter(t => t.type === 'chore');
        return {
            activeChores: chores.filter(c => c.status !== 'complete'),
            completedChores: chores.filter(c => c.status === 'complete'),
        };
    }, [tasks]);

    if (loading) return <p>Loading chores...</p>;

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Chores</h3>
                {activeChores.length > 0 ? (
                    <ul className="space-y-3">
                        {activeChores.map(chore => (
                            <li key={chore._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">{chore.title}</p>
                                    <p className="text-sm text-gray-500">
                                        {chore.points} points - Assigned to: {getAssignedNames(chore.assignedTo)}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button onClick={() => onEdit(chore)} className="text-sm font-semibold text-blue-600 hover:text-blue-800">Edit</button>
                                    <button onClick={() => onDelete(chore._id)} className="text-sm font-semibold text-red-600 hover:text-red-800">Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center p-4">No active chores!</p>
                )}
            </div>

            <div>
                <button 
                    onClick={() => setShowCompleted(!showCompleted)}
                    className="font-semibold text-gray-600 hover:text-gray-800"
                >
                    {showCompleted ? 'Hide' : 'Show'} Completed Chores ({completedChores.length})
                </button>
                {showCompleted && (
                    <div className="mt-4">
                        {completedChores.length > 0 ? (
                             <ul className="space-y-3">
                                {completedChores.map(chore => (
                                    <li key={chore._id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg opacity-70">
                                        <div>
                                            <p className="font-medium text-gray-600 line-through">{chore.title}</p>
                                            <p className="text-sm text-gray-500">
                                                {chore.points} points - Assigned to: {getAssignedNames(chore.assignedTo)}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-center p-4">No chores have been completed yet.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChoresManager;

