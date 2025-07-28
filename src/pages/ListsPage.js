import React, { useContext, useEffect, useState } from 'react';
import { ListContext } from '../context/ListContext';
import ListComponent from '../components/lists/ListComponent';
import { theme } from '../theme/theme';
import Card from '../components/shared/Card';
import InputField from '../components/shared/InputField';
import Button from '../components/shared/Button';

/**
 * The main page component for displaying and managing all lists.
 */
const ListsPage = () => {
  // Destructure state properties and the actions object directly from the context.
  // This is cleaner and aligns with the new context value structure.
  const { lists, loading, actions } = useContext(ListContext);
  const { fetchLists, createList } = actions;

  // Local state for the "create new list" input field.
  const [newListName, setNewListName] = useState('');

  // The `useEffect` hook to fetch lists when the component first mounts.
  // `fetchLists` is a dependency, but because it's wrapped in `useCallback` in the
  // context, it has a stable reference and won't cause an infinite loop.
  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  /**
   * Handles the submission of the "create new list" form.
   */
  const handleCreateList = (e) => {
    e.preventDefault(); // Prevent page reload.
    if (newListName.trim()) {
      // Call the context action to create the list.
      createList(newListName.trim());
      // Clear the input field.
      setNewListName('');
    }
  };

  // Display a loading message while the initial data fetch is in progress.
  if (loading) {
    return <div>Loading lists...</div>;
  }

  // A safeguard to prevent crashing if `lists` is not an array.
  if (!Array.isArray(lists)) {
    return <div>No lists found or there was an error loading them.</div>;
  }

  const pageStyle = {
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.textPrimary,
    padding: theme.spacing.xl, // Add some padding around the page
  };

  return (
    <div style={pageStyle}>
      <h1 style={{ ...theme.typography.h1, marginBottom: theme.spacing.lg }}>Shared Lists</h1>
      
      {/* Card containing the form to create a new list */}
      <Card style={{ marginBottom: theme.spacing.xl }}>
        <form onSubmit={handleCreateList} style={{ display: 'flex', gap: theme.spacing.md }}>
           <InputField
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="Create a new list (e.g., Groceries)"
            style={{ flexGrow: 1, marginBottom: 0 }}
          />
          <Button type="submit" variant="secondary">Create</Button>
        </form>
      </Card>

      {/* Display all the lists */}
      <div>
        {lists.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
            {/* Map over the lists array and render a ListComponent for each one. */}
            {lists.map(list => <ListComponent key={list._id} list={list} />)}
          </div>
        ) : (
          // Show a message if there are no lists to display.
          <p style={{ color: theme.colors.textSecondary, textAlign: 'center' }}>No lists yet. Create one to get started!</p>
        )}
      </div>
    </div>
  );
};

export default ListsPage;
