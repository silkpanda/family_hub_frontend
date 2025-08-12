// --- File: /frontend/src/pages/ListsPage.js ---
// Displays all shared lists for the family.

import React, { useState } from 'react';
import { useLists } from '../context/ListContext';
import ListComponent from '../components/lists/ListComponent';
import { theme } from '../theme/theme';
import Card from '../components/shared/Card';
import InputField from '../components/shared/InputField';
import Button from '../components/shared/Button';

const ListsPage = () => {
  const { state, actions } = useLists();
  const { lists, loading } = state;
  const { createList } = actions;
  
  const [newListName, setNewListName] = useState('');

  const handleCreateList = (e) => {
    e.preventDefault();
    if (newListName.trim() && createList) {
      createList({ name: newListName.trim() });
      setNewListName('');
    }
  };

  if (loading) {
    return <div>Loading lists...</div>;
  }

  const pageStyle = {
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.textPrimary,
    padding: theme.spacing.lg,
  };

  return (
    <div style={pageStyle}>
      <h1 style={{ ...theme.typography.h1, marginBottom: theme.spacing.lg }}>Shared Lists</h1>
      
      <Card style={{ marginBottom: theme.spacing.xl }}>
        <form onSubmit={handleCreateList} style={{ display: 'flex', gap: theme.spacing.md, alignItems: 'center' }}>
           <InputField
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="Create a new list (e.g., Groceries)"
            style={{ flexGrow: 1, marginBottom: 0 }}
          />
          <Button type="submit" variant="secondary">Create</Button>
        </form>
      </Card>

      <div>
        {lists && lists.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
            {lists.map(list => <ListComponent key={list._id} list={list} />)}
          </div>
        ) : (
          <p style={{ color: theme.colors.textSecondary, textAlign: 'center' }}>No lists yet. Create one to get started!</p>
        )}
      </div>
    </div>
  );
};

export default ListsPage;