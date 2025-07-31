import React, { useState } from 'react';
import { useLists } from '../../context/ListContext'; // <-- FIX
import { theme } from '../../theme/theme';
import Card from '../shared/Card';
import InputField from '../shared/InputField';
import Button from '../shared/Button';

const ListItem = ({ item, listId }) => {
  const { actions } = useLists(); // <-- FIX
  const { toggleItemCompletion, deleteItem } = actions;
  const itemStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: theme.spacing.sm, borderRadius: theme.spacing.sm };
  const contentStyle = { marginLeft: theme.spacing.md, color: theme.colors.textPrimary, textDecoration: item.isComplete ? 'line-through' : 'none', opacity: item.isComplete ? 0.6 : 1 };
  
  return (
    <div style={itemStyle}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input type="checkbox" checked={item.isComplete} onChange={() => toggleItemCompletion(listId, item._id)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
        <span style={contentStyle}>{item.content}</span>
      </div>
      <Button variant="tertiary" onClick={() => deleteItem(listId, item._id)} style={{ padding: theme.spacing.xs }}>X</Button>
    </div>
  );
};

const ListComponent = ({ list }) => {
  const { actions } = useLists(); // <-- FIX
  const { addItem, deleteList } = actions;
  const [newItemContent, setNewItemContent] = useState('');

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItemContent.trim()) {
      addItem(list._id, newItemContent.trim());
      setNewItemContent('');
    }
  };

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md }}>
        <h3 style={{ ...theme.typography.h4, color: theme.colors.textPrimary }}>{list.name}</h3>
        <Button variant="danger" onClick={() => deleteList(list._id)}>Delete List</Button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
        {list.items.map(item => <ListItem key={item._id} item={item} listId={list._id} />)}
      </div>
      <form onSubmit={handleAddItem} style={{ marginTop: theme.spacing.md, display: 'flex', gap: theme.spacing.md }}>
        <InputField value={newItemContent} onChange={(e) => setNewItemContent(e.target.value)} placeholder="Add a new item..." style={{ flexGrow: 1, marginBottom: 0 }} />
        <Button type="submit" variant="primary">Add</Button>
      </form>
    </Card>
  );
};
export default ListComponent;