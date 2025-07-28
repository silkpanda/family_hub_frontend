import React, { useContext, useState } from 'react';
import { ListContext } from '../../context/ListContext';
import { theme } from '../../theme/theme';
import Card from '../shared/Card';
import InputField from '../shared/InputField';
import Button from '../shared/Button';

/**
 * A sub-component to render a single item within a list.
 * It handles its own interactions, like toggling completion and deletion.
 * @param {object} item - The individual item object to render.
 * @param {string} listId - The ID of the parent list, needed for actions.
 */
const ListItem = ({ item, listId }) => {
  // Consume the context to get access to the action functions.
  const { actions } = useContext(ListContext);

  // Style for the item, applying a line-through for completed items.
  const contentStyle = {
    marginLeft: theme.spacing.md,
    color: theme.colors.textPrimary,
    textDecoration: item.isComplete ? 'line-through' : 'none',
    opacity: item.isComplete ? 0.6 : 1,
    transition: 'all 0.2s ease-in-out', // Smooth transition for style changes
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: theme.spacing.sm, borderRadius: theme.spacing.sm }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="checkbox"
          checked={item.isComplete}
          // Call the context action to toggle the item's completion status.
          onChange={() => actions.toggleItemCompletion(listId, item._id)}
          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
        />
        <span style={contentStyle}>{item.content}</span>
      </div>
      {/* Call the context action to delete the item. */}
      <Button variant="tertiary" onClick={() => actions.deleteItem(listId, item._id)} style={{ padding: theme.spacing.xs }}>X</Button>
    </div>
  );
};


/**
 * The main component for rendering an entire list, including its items and action forms.
 * @param {object} list - The list object to render.
 */
const ListComponent = ({ list }) => {
  // Consume the context to get access to the action functions.
  const { actions } = useContext(ListContext);
  // Local state to manage the content of the "add new item" input field.
  const [newItemContent, setNewItemContent] = useState('');

  /**
   * Handles the submission of the "add item" form.
   */
  const handleAddItem = (e) => {
    e.preventDefault(); // Prevent page reload on form submission.
    if (newItemContent.trim()) {
      // Call the context action to add the new item.
      actions.addItem(list._id, newItemContent.trim());
      // Clear the input field after submission.
      setNewItemContent('');
    }
  };

  return (
    <Card>
      {/* List Header: Title and Delete Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md }}>
        <h3 style={{ ...theme.typography.h4, color: theme.colors.textPrimary }}>{list.name}</h3>
        {/* Call the context action to delete the entire list. */}
        <Button variant="danger" onClick={() => actions.deleteList(list._id)}>Delete List</Button>
      </div>

      {/* List Items Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
        {list.items?.map(item => (
          // Use optional chaining on `list.items` as a safeguard.
          <ListItem key={item._id} item={item} listId={list._id} />
        ))}
      </div>

      {/* Form for adding a new item to the list */}
      <form onSubmit={handleAddItem} style={{ marginTop: theme.spacing.md, display: 'flex', gap: theme.spacing.md }}>
        <InputField
          value={newItemContent}
          onChange={(e) => setNewItemContent(e.target.value)}
          placeholder="Add a new item..."
          style={{ flexGrow: 1, marginBottom: 0 }} // Style overrides
        />
        <Button type="submit" variant="primary">Add</Button>
      </form>
    </Card>
  );
};

export default ListComponent;
