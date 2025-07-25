import React, { useContext, useEffect, useState } from 'react';
import { ListContext } from '../context/ListContext';
import ListComponent from '../components/lists/ListComponent'; // Assuming ListComponent is moved to its own file

const ListsPage = () => {
  const { lists, loading, fetchLists, createList } = useContext(ListContext);
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    // Fetch lists when the component mounts
    fetchLists();
  }, [fetchLists]);

  const handleCreateList = (e) => {
    e.preventDefault();
    if (newListName.trim()) {
      createList(newListName.trim());
      setNewListName('');
    }
  };

  if (loading) {
    return (
        <div className="p-4 md:p-8 text-center">
            <p className="text-gray-500">Loading lists...</p>
        </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Shared Lists</h1>
      
      {/* Form to create a new list */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
        <form onSubmit={handleCreateList} className="flex max-w-lg">
           <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="Create a new list (e.g., Groceries, Weekend Chores)"
            className="flex-grow border border-gray-300 rounded-l-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded-r-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Create
          </button>
        </form>
      </div>

      {/* Display existing lists */}
      <div>
        {lists.length > 0 ? (
          <div className="space-y-6">
            {lists.map(list => <ListComponent key={list._id} list={list} />)}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No lists yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListsPage;
