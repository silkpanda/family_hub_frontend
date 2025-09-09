import React, { useContext, useMemo } from 'react';
import { TaskContext } from '../../context/TaskContext';
import { HouseholdContext } from '../../context/HouseholdContext';

/**
 * A component to display and manage daily routines.
 */
const RoutinesManager = ({ onEdit, onDelete }) => {
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

    const routines = useMemo(() => tasks.filter(t => t.type === 'routine'), [tasks]);

    const groupedRoutines = useMemo(() => {
        const groups = { morning: [], afternoon: [], evening: [], any: [] };
        routines.forEach(routine => {
            const groupKey = routine.timeOfDay || 'any';
            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(routine);
        });
        return groups;
    }, [routines]);

    if (loading) return <p>Loading routines...</p>;

    return (
        <div className="space-y-6">
            {Object.entries(groupedRoutines).map(([group, list]) => (
                list.length > 0 && (
                    <div key={group}>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2 capitalize border-b pb-1">{group}</h3>
                        <ul className="space-y-3">
                            {list.map(routine => (
                                <li key={routine._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">{routine.title}</p>
                                        <p className="text-sm text-gray-500">
                                            {routine.points} points - Assigned to: {getAssignedNames(routine.assignedTo)}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button onClick={() => onEdit(routine)} className="text-sm font-semibold text-blue-600 hover:text-blue-800">Edit</button>
                                        <button onClick={() => onDelete(routine._id)} className="text-sm font-semibold text-red-600 hover:text-red-800">Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            ))}
        </div>
    );
};

export default RoutinesManager;
