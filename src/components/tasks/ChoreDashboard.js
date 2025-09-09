import React, { useState, useContext } from 'react';
import { ChoreContext } from '../context/ChoreProvider';
import { HouseholdContext } from '../context/HouseholdContext';
import { Card } from './shared/Card';

const ChoreDashboard = () => {
    const { chores, loading, addChore, updateChore, deleteChore } = useContext(ChoreContext);
    const { householdData } = useContext(HouseholdContext);

    const [newChoreTitle, setNewChoreTitle] = useState('');
    const [assignedTo, setAssignedTo] = useState('');

    const handleAddChore = (e) => {
        e.preventDefault();
        if (!newChoreTitle.trim()) return;
        
        const choreData = {
            title: newChoreTitle,
            assignedTo: assignedTo || null, // Send null if no one is assigned
        };
        addChore(choreData);
        setNewChoreTitle('');
        setAssignedTo('');
    };
    
    const toggleComplete = (chore) => {
        updateChore(chore._id, { isComplete: !chore.isComplete });
    };

    return (
        <div className="mt-8">
            <Card>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Chores</h2>
                
                {/* Form to add a new chore */}
                <form onSubmit={handleAddChore} className="flex flex-col sm:flex-row gap-4 mb-6">
                    <input
                        type="text"
                        value={newChoreTitle}
                        onChange={(e) => setNewChoreTitle(e.target.value)}
                        placeholder="Add a new chore..."
                        className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    <select
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="">Unassigned</option>
                        {householdData.members.map(member => (
                            <option key={member._id} value={member._id}>{member.displayName}</option>
                        ))}
                    </select>
                    <button type="submit" className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700">
                        Add Chore
                    </button>
                </form>

                {/* List of chores */}
                {loading ? <p>Loading chores...</p> : (
                    <ul className="space-y-3">
                        {chores.length > 0 ? chores.map(chore => (
                            <li key={chore._id} className={`flex items-center justify-between p-3 rounded-lg ${chore.isComplete ? 'bg-gray-200' : 'bg-white'}`}>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={chore.isComplete}
                                        onChange={() => toggleComplete(chore)}
                                        className="h-6 w-6 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <div className="ml-4">
                                        <p className={`font-medium ${chore.isComplete ? 'line-through text-gray-500' : 'text-gray-900'}`}>{chore.title}</p>
                                        {chore.assignedTo ? (
                                            <span className="text-sm text-gray-500">Assigned to: {chore.assignedTo.displayName}</span>
                                        ) : (
                                            <span className="text-sm text-gray-400">Unassigned</span>
                                        )}
                                    </div>
                                </div>
                                <button onClick={() => deleteChore(chore._id)} className="text-red-500 hover:text-red-700 font-semibold">
                                    Delete
                                </button>
                            </li>
                        )) : <p className="text-gray-500 text-center">No chores yet. Add one to get started!</p>}
                    </ul>
                )}
            </Card>
        </div>
    );
};

export default ChoreDashboard;
