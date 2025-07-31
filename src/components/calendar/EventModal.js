import React, { useState, useEffect } from 'react';
import { useCalendar } from '../../context/CalendarContext'; // <-- FIX: Import the custom hook
import { theme } from '../../theme/theme';
import Card from '../shared/Card';
import Button from '../shared/Button';
import InputField from '../shared/InputField';

const EventModal = ({ event, dateInfo, onClose }) => {
  // --- FIX: Use the custom hook to get the actions ---
  const { actions } = useCalendar();
  const { addEvent, updateEvent, deleteEvent } = actions;

  const [formData, setFormData] = useState({ title: '', description: '', startTime: '', endTime: '' });
  const isEditing = event !== null;

  useEffect(() => {
    if (isEditing) {
      const formatForInput = (date) => new Date(date).toISOString().slice(0, 16);
      setFormData({
        title: event.title,
        description: event.description || '',
        startTime: formatForInput(event.startTime),
        endTime: formatForInput(event.endTime),
      });
    } else if (dateInfo) {
      const formatForInput = (date) => new Date(date).toISOString().slice(0, 16);
      setFormData({
        title: '',
        description: '',
        startTime: formatForInput(dateInfo.startStr),
        endTime: formatForInput(dateInfo.endStr),
      });
    }
  }, [event, dateInfo, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventData = {
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
    };
    if (isEditing) {
      updateEvent(event._id, eventData);
    } else {
      addEvent(eventData);
    }
    onClose();
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
        deleteEvent(event._id);
        onClose();
    }
  }

  const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  };

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