import React, { useContext, useEffect, useState } from 'react';
import { ChoreContext } from '../context/ChoreContext';
import { theme } from '../theme/theme';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import InputField from '../components/shared/InputField';

// --- Individual Chore Item Component ---
// Defined outside the main component to prevent re-render loops.
const ChoreItem = ({ chore }) => {
  const { toggleChoreCompletion, deleteChore } = useContext(ChoreContext);

  const cardStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: chore.isComplete ? '#f0fdf4' : theme.colors.neutralSurface, // A light green for completed
  };

  const titleStyle = {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    textDecoration: chore.isComplete ? 'line-through' : 'none',
    opacity: chore.isComplete ? 0.7 : 1,
  };

  const assignedToStyle = {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  };

  return (
    <Card style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="checkbox"
          checked={chore.isComplete}
          onChange={() => toggleChoreCompletion(chore._id)}
          style={{ width: '24px', height: '24px', cursor: 'pointer' }}
        />
        <div style={{ marginLeft: theme.spacing.md }}>
          <p style={titleStyle}>{chore.title}</p>
          <p style={assignedToStyle}>
            {chore.assignedTo ? `Assigned to: ${chore.assignedTo.displayName}` : 'Unassigned'}
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
        <span style={{ ...theme.typography.h4, color: theme.colors.secondaryBrand }}>{chore.points} pts</span>
        <Button variant="danger" onClick={() => deleteChore(chore._id)}>Delete</Button>
      </div>
    </Card>
  );
};


// --- Main Page to Display All Chores ---
const ChoresPage = () => {
  const { chores, loading, fetchChores, createChore } = useContext(ChoreContext);
  const [newChore, setNewChore] = useState({ title: '', points: 0, assignedTo: '' });

  useEffect(() => {
    fetchChores();
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
        assignedTo: newChore.assignedTo || null,
      };
      createChore(choreData);
      setNewChore({ title: '', points: 0, assignedTo: '' });
    }
  };

  if (loading) {
    return <div>Loading chores...</div>;
  }

  const pageStyle = {
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.textPrimary,
  };

  return (
    <div style={pageStyle}>
      <h1 style={{ ...theme.typography.h1, marginBottom: theme.spacing.lg }}>Chore Management</h1>
      
      <Card style={{ marginBottom: theme.spacing.xl }}>
        <h2 style={{ ...theme.typography.h3, marginBottom: theme.spacing.md }}>Add a New Chore</h2>
        <form onSubmit={handleCreateChore} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: theme.spacing.md, alignItems: 'flex-end' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <InputField label="Chore Title" name="title" value={newChore.title} onChange={handleChange} placeholder="e.g., Take out the trash" required />
          </div>
          <div>
            <InputField label="Points" name="points" type="number" value={newChore.points} onChange={handleChange} />
          </div>
          {/* Assignment dropdown would go here */}
          <Button type="submit" variant="secondary" style={{ height: '50px' }}>Add Chore</Button>
        </form>
      </Card>

      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
        {chores.length > 0 ? (
          chores.map(chore => <ChoreItem key={chore._id} chore={chore} />)
        ) : (
          <p style={{ color: theme.colors.textSecondary, textAlign: 'center' }}>No chores yet. Add one to get started!</p>
        )}
      </div>
    </div>
  );
};

export default ChoresPage;
