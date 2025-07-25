import React, { useContext, useEffect, useState } from 'react';
import { ChoreContext } from '../context/ChoreContext';
// We'll need user data to assign chores
// import { UserContext } from '../context/UserContext'; // Assuming a UserContext exists to get family members

// --- Individual Chore Item Component ---
const ChoreItem = ({ chore }) => {
  const { toggleChoreCompletion, deleteChore } = useContext(ChoreContext);
  // const { familyMembers } = useContext(UserContext); // Example for assigning users

  return (
    <div className={`p-4 rounded-lg shadow-sm flex items-center justify-between ${chore.isComplete ? 'bg-green-100' : 'bg-white'}`}>
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={chore.isComplete}
          onChange={() => toggleChoreCompletion(chore._id)}
          className="h-6 w-6 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        <div className="ml-4">
          <p className={`font-semibold text-gray-900 ${chore.isComplete ? 'line-through' : ''}`}>{chore.title}</p>
          <p className="text-sm text-gray-500">
            {chore.assignedTo ? `Assigned to: ${chore.assignedTo.displayName}` : 'Unassigned'}
          </p>
        </div>
      </div>
      <div className="flex items-center">
        <span className="text-lg font-bold text-yellow-500 mr-4">{chore.points} pts</span>
        <button onClick={() => deleteChore(chore._id)} className="text-gray-400 hover:text-red-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};


// --- Main Page to Display All Chores ---
const ChoresPage = () => {
  const { chores, loading, fetchChores, createChore } = useContext(ChoreContext);
  // const { familyMembers } = useContext(UserContext); // Example for user assignment
  const [newChore, setNewChore] = useState({ title: '', points: 0, assignedTo: '' });

  useEffect(() => {
    fetchChores();
    // fetchFamilyMembers(); // You would also fetch users for the assignment dropdown
  }, [fetchChores]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewChore(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateChore = (e) => {
    e.preventDefault();
    if (newChore.title.trim()) {
      const choreData = {
        ...newChore,
        points: Number(newChore.points) || 0,
        assignedTo: newChore.assignedTo || null, // Ensure null if empty
      };
      createChore(choreData);
      setNewChore({ title: '', points: 0, assignedTo: '' }); // Reset form
    }
  };

  if (loading) {
    return <div>Loading chores...</div>;
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Chore Management</h1>
      
      {/* Form to create a new chore */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Add a New Chore</h2>
        <form onSubmit={handleCreateChore} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Chore Title</label>
            <input type="text" name="title" value={newChore.title} onChange={handleChange} placeholder="e.g., Take out the trash" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label htmlFor="points" className="block text-sm font-medium text-gray-700">Points</label>
            <input type="number" name="points" value={newChore.points} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          {/* <div>
            <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">Assign To</label>
            <select name="assignedTo" value={newChore.assignedTo} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
              <option value="">Unassigned</option>
              {familyMembers.map(member => (
                <option key={member._id} value={member._id}>{member.displayName}</option>
              ))}
            </select>
          </div> */}
          <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 w-full">
            Add Chore
          </button>
        </form>
      </div>

      {/* Display existing chores */}
      <div className="space-y-4">
        {chores.length > 0 ? (
          chores.map(chore => <ChoreItem key={chore._id} chore={chore} />)
        ) : (
          <p className="text-gray-500 text-center py-10">No chores yet. Add one to get started!</p>
        )}
      </div>
    </div>
  );
};

export default ChoresPage;
