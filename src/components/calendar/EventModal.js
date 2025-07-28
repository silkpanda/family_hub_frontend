// ===================================================================================
// File: src/components/calendar/EventModal.js
// Purpose: This component is the modal (pop-up) used for creating and editing events.
// It uses the shared "Branded Core" components for a consistent UI.
// ===================================================================================
import React, { useState, useContext, useEffect } from 'react';
import { CalendarContext } from '../../context/CalendarContext';
import { theme } from '../../theme/theme';
import Card from '../shared/Card';
import Button from '../shared/Button';
import InputField from '../shared/InputField';

const EventModal = ({ event, dateInfo, onClose }) => {
  // --- State Management ---
  // --- FIX ---
  // The destructuring from the context has been rewritten to be more explicit.
  // This resolves the parsing error by separating the hook call from the destructuring.
  const calendarContext = useContext(CalendarContext);
  const { addEvent, updateEvent, deleteEvent } = calendarContext;

  // Local state to manage the form fields.
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
  });
  
  // Determines if the modal is for editing an existing event or creating a new one.
  const isEditing = event !== null;

  // --- Form Population ---
  // This effect runs when the modal opens. It populates the form fields based on
  // whether we are editing an existing event or creating a new one.
  useEffect(() => {
    if (isEditing) {
      // Helper to format date strings correctly for the <input type="datetime-local"> element.
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

  // --- Event Handlers ---
  // A generic handler to update the form state as the user types.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handles the form submission.
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the default browser page reload on form submission.
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
    onClose(); // Close the modal after submission.
  };
  
  // Handles the delete action.
  const handleDelete = () => {
    // A simple confirmation dialog before deleting.
    if (window.confirm('Are you sure you want to delete this event?')) {
        deleteEvent(event._id);
        onClose();
    }
  }

  // This style creates the dark, semi-transparent overlay behind the modal.
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center', // Vertically centers the modal
    justifyContent: 'center', // Horizontally centers the modal
    zIndex: 1000, // Ensures the modal appears on top of other content
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
                {isEditing && (
                    <Button type="button" variant="danger" onClick={handleDelete}>Delete</Button>
                )}
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
