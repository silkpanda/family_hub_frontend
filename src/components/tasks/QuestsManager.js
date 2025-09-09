import React, { useContext, useMemo } from 'react';
import { TaskContext } from '../../context/TaskContext';
import { HouseholdContext } from '../../context/HouseholdContext';

/**
 * A component to display and manage special, multi-person quests.
 */
const QuestsManager = ({ onEdit, onDelete }) => {
    const { tasks, loading } = useContext(TaskContext);
    const { householdData } = useContext(HouseholdContext);

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

    const quests = useMemo(() => tasks.filter(t => t.type === 'quest'), [tasks]);

    if (loading) return <p>Loading quests...</p>;

    return (
        <div className="space-y-4">
            {quests.length > 0 ? (
                quests.map(quest => (
                    <div key={quest._id} className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-bold text-lg text-yellow-900">{quest.title}</p>
                                <p className="text-sm text-yellow-700">
                                    {quest.points} points - {quest.isRepeatable ? `Repeats ${quest.repeatFrequency}` : 'One-time quest'}
                                </p>
                                <p className="text-sm text-yellow-700">
                                    Assigned to: {getAssignedNames(quest.assignedTo)}
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button onClick={() => onEdit(quest)} className="text-sm font-semibold text-blue-600 hover:text-blue-800">Edit</button>
                                <button onClick={() => onDelete(quest._id)} className="text-sm font-semibold text-red-600 hover:text-red-800">Delete</button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500 text-center p-8">No active quests. Create one to challenge your family!</p>
            )}
        </div>
    );
};

export default QuestsManager;
