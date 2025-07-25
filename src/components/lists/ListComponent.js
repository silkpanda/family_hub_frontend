import React, { useContext, useState } from 'react';
import { ListContext } from '../../context/ListContext';

// --- Sub-component for an individual list item ---
// Keeping this in the same file as it's tightly coupled with ListComponent.
const ListItem = ({ item, listId }) => {
  const { toggleItemCompletion, deleteItem } = useContext(ListContext);

  return (
    <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md transition-colors duration-150">
      <div className="flex items-center flex-grow min-w-0">
        <input
          type="checkbox"
          checked={item.isComplete}
          onChange={() => toggleItemCompletion(listId, item._id)}
          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        <span className={`ml-3 text-gray-800 break-words ${item.isComplete ? 'line-through text-gray-500' : ''}`}>
          {item.content}
        </span>
      </div>
      <button onClick={() => deleteItem(listId, item._id)} className="ml-4 text-gray-400 hover:text-red-600 flex-shrink-0">
        {/* Simple 'X' icon for delete */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};


// --- Main component for an entire list (e.g., "Groceries") ---
const ListComponent = ({ list }) => {
  const { addItem, deleteList } = useContext(ListContext);
  const [newItemContent, setNewItemContent] = useState('');

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItemContent.trim()) {
      addItem(list._id, newItemContent.trim());
      setNewItemContent('');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">{list.name}</h3>
        <button onClick={() => deleteList(list._id)} className="text-sm font-medium text-red-500 hover:text-red-700">
            Delete List
        </button>
      </div>
      <div className="space-y-2">
        {list.items.map(item => (
          <ListItem key={item._id} item={item} listId={list._id} />
        ))}
      </div>
      <form onSubmit={handleAddItem} className="mt-4 flex">
        <input
          type="text"
          value={newItemContent}
          onChange={(e) => setNewItemContent(e.target.value)}
          placeholder="Add a new item..."
          className="flex-grow border border-gray-300 rounded-l-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Add
        </button>
      </form>
    </div>
  );
};

export default ListComponent;
