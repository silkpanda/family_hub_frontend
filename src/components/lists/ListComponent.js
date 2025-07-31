// ===================================================================================
// File: /frontend/src/components/lists/ListComponent.js
// Purpose: Renders an individual shared list and its items, now with list-level assignment.
//
// --- Dev Notes (UPDATE) ---
// - `ListItem`: No longer contains any assignment logic. It's a simpler component now.
// - `ListAssigneeManager`: A new component added to the header of the list. It displays
//   avatars of assigned members and includes a dropdown menu to modify the assignments.
// - `ListComponent`: The "Add Item" form no longer has an assignment dropdown.
// ===================================================================================
import React, { useState, useContext } from 'react';
import { useLists } from '../../context/ListContext';
import { useFamily } from '../../context/FamilyContext';
import { theme } from '../../theme/theme';
import Card from '../shared/Card';
import InputField from '../shared/InputField';
import Button from '../shared/Button';

const ListItem = ({ item, listId }) => {
  const { actions } = useLists();
  const { toggleItemCompletion, deleteItem } = actions;
  const itemStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: theme.spacing.sm, borderRadius: theme.spacing.sm };
  const contentStyle = { marginLeft: theme.spacing.md, color: theme.colors.textPrimary, textDecoration: item.isComplete ? 'line-through' : 'none', opacity: item.isComplete ? 0.6 : 1 };
  
  return (
    <div style={itemStyle}>
      <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
        <input type="checkbox" checked={item.isComplete} onChange={() => toggleItemCompletion && toggleItemCompletion(listId, item._id)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
        <span style={contentStyle}>{item.content}</span>
      </div>
      <Button variant="tertiary" onClick={() => deleteItem && deleteItem(listId, item._id)} style={{ padding: theme.spacing.xs }}>X</Button>
    </div>
  );
};

const ListAssigneeManager = ({ list }) => {
    const { actions } = useLists();
    const { assignList } = actions;
    const { state: familyState } = useFamily();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const assignedMemberIds = list.assignedTo.map(m => m._id);

    const handleAssignmentChange = (memberId) => {
        const newAssignedIds = assignedMemberIds.includes(memberId)
            ? assignedMemberIds.filter(id => id !== memberId)
            : [...assignedMemberIds, memberId];
        if (assignList) assignList(list._id, newAssignedIds);
    };

    const avatarStyle = (color) => ({
        width: '28px', height: '28px', borderRadius: '50%',
        backgroundColor: color || theme.colors.textSecondary,
        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 'bold', fontSize: '12px', border: '2px solid white'
    });

    return (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex' }}>
                {list.assignedTo.map((member, index) => {
                    const familyMember = familyState.family.members.find(m => m.userId._id === member._id);
                    return (
                        <div key={member._id} style={{ ...avatarStyle(familyMember?.color), marginLeft: index > 0 ? '-8px' : 0 }}>
                            {member.displayName.charAt(0).toUpperCase()}
                        </div>
                    );
                })}
            </div>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ ...avatarStyle('#e0e0e0'), color: '#333', cursor: 'pointer', marginLeft: list.assignedTo.length > 0 ? '-8px' : 0, zIndex: 5 }}>+</button>
            {isMenuOpen && (
                <div style={{ position: 'absolute', right: 0, top: '32px', backgroundColor: 'white', borderRadius: theme.borderRadius.medium, boxShadow: theme.shadows.medium, zIndex: 10, width: '200px' }}>
                    <p style={{ padding: '8px 12px', fontWeight: 'bold', borderBottom: '1px solid #eee' }}>Assign Members</p>
                    {familyState.family.members.map(member => (
                        <label key={member.userId._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', cursor: 'pointer' }}>
                            <input type="checkbox" checked={assignedMemberIds.includes(member.userId._id)} onChange={() => handleAssignmentChange(member.userId._id)} />
                            {member.userId.displayName}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

const ListComponent = ({ list }) => {
  const { actions } = useLists();
  const { addItem, deleteList } = actions;
  const [newItemContent, setNewItemContent] = useState('');

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItemContent.trim() && addItem) {
      addItem(list._id, { content: newItemContent.trim() });
      setNewItemContent('');
    }
  };

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md }}>
        <h3 style={{ ...theme.typography.h4, color: theme.colors.textPrimary }}>{list.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
            <ListAssigneeManager list={list} />
            <Button variant="danger" onClick={() => deleteList && deleteList(list._id)}>Delete List</Button>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
        {list.items.map(item => <ListItem key={item._id} item={item} listId={list._id} />)}
      </div>
      <form onSubmit={handleAddItem} style={{ marginTop: theme.spacing.md, display: 'flex', gap: theme.spacing.md, alignItems: 'center' }}>
        <InputField value={newItemContent} onChange={(e) => setNewItemContent(e.target.value)} placeholder="Add a new item..." style={{ flexGrow: 1, marginBottom: 0 }} />
        <Button type="submit" variant="primary">Add</Button>
      </form>
    </Card>
  );
};
export default ListComponent;
