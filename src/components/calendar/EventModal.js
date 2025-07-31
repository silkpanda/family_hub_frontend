// ===================================================================================
// File: /frontend/src/components/calendar/EventModal.js
// Purpose: The modal dialog for creating and editing calendar events.
//
// --- DEBUGGING UPDATE (Step 2) ---
// This file is being updated to ensure its imports are correct, resolving the
// compilation errors. The logic of the component itself remains unchanged.
//
// 1.  Confirmed `useCalendar` Import: The import statement for `useCalendar` is
//     verified to be a correct named import, which will work once the corresponding
//     `CalendarContext.js` file is also corrected.
// ===================================================================================
import React, { useState, useEffect, useContext } from 'react';
import { useCalendar } from '../../context/CalendarContext'; // Correct named import
import { FamilyContext } from '../../context/FamilyContext';
import { theme } from '../../theme/theme';
import Card from '../shared/Card';
import Button from '../shared/Button';
import InputField from '../shared/InputField';

const EventModal = ({ event, dateInfo, onClose }) => {
  const { actions: calendarActions } = useCalendar();
  const { createEvent, updateEvent, deleteEvent } = calendarActions;

  const { state: familyState } = useContext(FamilyContext);
  const { family } = familyState;
  const familyMembers = family?.members || [];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
  });
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const isEditing = event !== null;

  useEffect(() => {
    const formatForInput = (date) => {
        const d = new Date(date);
        return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 16);
    };

    if (isEditing && event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        startTime: formatForInput(event.startTime),
        endTime: formatForInput(event.endTime),
      });
      // Ensure we map correctly, whether assignedTo is populated or just IDs
      const assigneeIds = event.assignedTo ? event.assignedTo.map(member => member._id || member) : [];
      setSelectedAssignees(assigneeIds);
    } else if (dateInfo) {
      setFormData({
        title: '',
        description: '',
        startTime: formatForInput(dateInfo.startStr),
        endTime: formatForInput(dateInfo.endStr),
      });
      setSelectedAssignees([]);
    }
  }, [event, dateInfo, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAssigneeChange = (userId) => {
    setSelectedAssignees(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const startDate = new Date(formData.startTime);
    const endDate = new Date(formData.endTime);
    const isAllDayEvent = startDate.toDateString() !== endDate.toDateString();

    const eventData = {
        ...formData,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        assignedTo: selectedAssignees,
        isAllDay: isAllDayEvent,
    };

    try {
        if (isEditing) {
            if(updateEvent) await updateEvent(event._id, eventData);
        } else {
            if(createEvent) await createEvent(eventData);
        }
        onClose();
    } catch (error) {
        console.error('[EventModal] Error submitting event:', error);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
        try {
            if(deleteEvent) await deleteEvent(event._id);
            onClose();
        }
        catch (error) {
            console.error('[EventModal] Error deleting event:', error);
        }
    }
  };

  const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  };

  const assigneeTagStyle = (memberColor) => ({
    display: 'flex', alignItems: 'center', gap: theme.spacing.xs,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: memberColor,
    color: theme.colors.neutralSurface,
    cursor: 'pointer',
    fontSize: theme.typography.caption.fontSize,
  });

  return (
    <div style={modalOverlayStyle}>
      <Card style={{ width: '100%', maxWidth: '500px' }}>
        <h2 style={{ ...theme.typography.h3, color: theme.colors.textPrimary, marginBottom: theme.spacing.lg }}>
            {isEditing ? 'Edit Event' : 'Add Event'}
        </h2>
        <form onSubmit={handleSubmit}>
          <InputField label="Title" name="title" value={formData.title} onChange={handleChange} required />
          <InputField label="Start Time" name="startTime" type="datetime-local" value={formData.startTime} onChange={handleChange} required />
          <InputField label="End Time" name="endTime" type="datetime-local" value={formData.endTime} onChange={handleChange} required />
          <InputField label="Description" name="description" as="textarea" value={formData.description} onChange={handleChange} />
          
          <div style={{ marginBottom: theme.spacing.lg }}>
            <label style={{ ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.sm, display: 'block' }}>Assign to Family Members:</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing.sm }}>
              {familyMembers.length > 0 ? (
                familyMembers.map(member => (
                  <label key={member.userId._id} style={assigneeTagStyle(member.color)}>
                    <input
                      type="checkbox"
                      value={member.userId._id}
                      checked={selectedAssignees.includes(member.userId._id)}
                      onChange={() => handleAssigneeChange(member.userId._id)}
                      style={{ marginRight: theme.spacing.xs }}
                    />
                    {member.userId.displayName}
                  </label>
                ))
              ) : (
                <p style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>No family members found to assign.</p>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: theme.spacing.lg }}>
            <div>
                {isEditing && (<Button type="button" variant="danger" onClick={handleDelete}>Delete</Button>)}
            </div>
            <div style={{ display: 'flex', gap: theme.spacing.md }}>
                <Button type="button" variant="tertiary" onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="primary">{isEditing ? 'Save Changes' : 'Create Event'}</Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EventModal;
