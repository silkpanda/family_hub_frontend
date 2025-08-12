// --- File: /frontend/src/components/chores/AddChoreRoutineModal.js ---
// A modal for adding a new chore or routine for a specific family member.

import React, { useState } from 'react';
import { useChores } from '../../context/ChoreContext';
import { theme } from '../../theme/theme';
import Card from '../shared/Card';
import Button from '../shared/Button';
import InputField from '../shared/InputField';

const AddChoreRoutineModal = ({ member, onClose }) => {
    const { actions } = useChores();
    const { createChore } = actions;
    const [view, setView] = useState('select'); // 'select' or 'form'
    const [isRoutine, setIsRoutine] = useState(false);
    const [formData, setFormData] = useState({ title: '', points: 10, routineCategory: 'Morning' });

    const handleSelect = (routine) => {
        setIsRoutine(routine);
        setView('form');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (createChore) {
            const choreData = {
                title: formData.title,
                assignedTo: member.userId._id,
                points: isRoutine ? 0 : Number(formData.points) || 0,
                ...(isRoutine && { routineCategory: formData.routineCategory }),
            };
            createChore(choreData);
        }
        onClose();
    };

    const modalOverlayStyle = {
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    };

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <Card style={{ width: '100%', maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
                {view === 'select' ? (
                    <div>
                        <h2 style={theme.typography.h3}>Add for {member.userId.displayName}</h2>
                        <p style={{ ...theme.typography.caption, color: theme.colors.textSecondary, margin: `${theme.spacing.md} 0` }}>
                            What would you like to add? Chores have points, routines do not.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
                            <Button variant="primary" onClick={() => handleSelect(false)}>New Chore</Button>
                            <Button variant="secondary" onClick={() => handleSelect(true)}>New Routine</Button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <h2 style={theme.typography.h3}>New {isRoutine ? 'Routine' : 'Chore'}</h2>
                        <InputField label="Title" name="title" value={formData.title} onChange={handleChange} required />
                        {isRoutine && (
                            <div style={{ marginBottom: theme.spacing.md }}>
                                <label style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>Category</label>
                                <select name="routineCategory" value={formData.routineCategory} onChange={handleChange} style={{ width: '100%', padding: theme.spacing.sm, marginTop: theme.spacing.xs, border: '1px solid #EAECEE', borderRadius: theme.borderRadius.medium, backgroundColor: theme.colors.neutralBackground }}>
                                    <option value="Morning">Morning</option>
                                    <option value="Day">Day</option>
                                    <option value="Night">Night</option>
                                </select>
                            </div>
                        )}
                        {!isRoutine && (
                            <InputField label="Points" name="points" type="number" value={formData.points} onChange={handleChange} />
                        )}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: theme.spacing.md, marginTop: theme.spacing.lg }}>
                            <Button type="button" variant="tertiary" onClick={() => setView('select')}>Back</Button>
                            <Button type="submit" variant="primary">Add</Button>
                        </div>
                    </form>
                )}
            </Card>
        </div>
    );
};

export default AddChoreRoutineModal;