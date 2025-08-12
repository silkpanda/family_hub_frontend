// --- File: /frontend/src/components/profile/InteractiveListModal.js ---
// A modal that displays an interactive version of a shared list on the user profile page.

import React from 'react';
import { useLists } from '../../context/ListContext';
import { theme } from '../../theme/theme';
import Card from '../shared/Card';
import Button from '../shared/Button';

const InteractiveListItem = ({ item, listId }) => {
  const { actions } = useLists();
  const { toggleItemCompletion, deleteItem } = actions;

  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.sm,
    borderBottom: `1px solid ${theme.colors.neutralBackground}`,
  };
  const contentStyle = {
    marginLeft: theme.spacing.md,
    color: theme.colors.textPrimary,
    textDecoration: item.isComplete ? 'line-through' : 'none',
    opacity: item.isComplete ? 0.6 : 1,
  };

  return (
    <div style={itemStyle}>
      <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
        <input
          type="checkbox"
          checked={item.isComplete}
          onChange={() => toggleItemCompletion && toggleItemCompletion(listId, item._id)}
          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
        />
        <span style={contentStyle}>{item.content}</span>
      </div>
      <Button variant="tertiary" onClick={() => deleteItem && deleteItem(listId, item._id)} style={{ padding: theme.spacing.xs }}>
        X
      </Button>
    </div>
  );
};

const InteractiveListModal = ({ list, onClose }) => {
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  if (!list) return null;

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <Card style={{ width: '100%', maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ ...theme.typography.h3, marginBottom: theme.spacing.md }}>{list.name}</h2>
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {list.items.map(item => (
            <InteractiveListItem key={item._id} item={item} listId={list._id} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: theme.spacing.md }}>
          <Button variant="primary" onClick={onClose}>Close</Button>
        </div>
      </Card>
    </div>
  );
};

export default InteractiveListModal;