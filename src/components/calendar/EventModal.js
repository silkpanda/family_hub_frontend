// ===================================================================================
// File: /frontend/src/components/calendar/EventModal.js
// Purpose: The modal dialog for creating and editing calendar events.
//
// --- Dev Notes (UI Refinement) ---
// - This component has been completely overhauled to be a moveable "pop-out" modal.
// - It now receives a `position` prop from the CalendarPage.
// - `useEffect` is used to calculate the initial position of the modal, intelligently
//   placing it to the right or left of the clicked element to avoid the sidebar.
// - State variables (`isDragging`, `currentPosition`, `dragOffset`) have been added
//   to manage the dragging behavior.
// - Event handlers (`handleMouseDown`, `handleMouseMove`, `handleMouseUp`) are used
//   to implement the dragging logic.
// - REFINEMENT: Added a subtle fade-in and scale-up animation for a more polished appearance.
// - REFINEMENT: Added a CSS transition to the `top` and `left` properties, so the
//   modal smoothly slides to a new position when a different day is clicked.
// - BUG FIX: The initial appearance animation was a slide, not a fade/scale. This
//   was fixed by conditionally applying the `transition` properties. The slide
//   transition is now only active *after* the initial fade-in animation is complete.
// ===================================================================================
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { FamilyContext } from '../../context/FamilyContext';
import { theme } from '../../theme/theme';
import Card from '../shared/Card';
import Button from '../shared/Button';
import InputField from '../shared/InputField';

const EventModal = ({ event, dateInfo, onClose, position }) => {
  const { actions: calendarActions } = useCalendar();
  const { createEvent, updateEvent, deleteEvent } = calendarActions;
  const { state: familyState } = useContext(FamilyContext);
  const familyMembers = familyState.family?.members || [];

  const [formData, setFormData] = useState({ title: '', description: '', startTime: '', endTime: '' });
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const isEditing = event !== null;

  const [currentPosition, setCurrentPosition] = useState({ top: 0, left: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isPositioned, setIsPositioned] = useState(false);
  const modalRef = useRef(null);

  // Effect to set the initial position of the modal
  useEffect(() => {
    if (position && modalRef.current) {
        const modalWidth = modalRef.current.offsetWidth;
        const sidebarWidth = 240;
        let leftPos;

        if (position.left < sidebarWidth + modalWidth + 30) {
            leftPos = position.right + 10;
        } else {
            leftPos = position.left - modalWidth - 10;
        }

        const topPos = Math.max(10, Math.min(position.top, window.innerHeight - modalRef.current.offsetHeight - 10));
        leftPos = Math.max(10, Math.min(leftPos, window.innerWidth - modalWidth - 10));

        setCurrentPosition({ top: topPos, left: leftPos });
        // Use a timeout to allow the browser to apply the position before starting the animation
        setTimeout(() => setIsPositioned(true), 10);
    }
  }, [position]);

  // Effect to handle dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setCurrentPosition({ top: e.clientY - dragOffset.y, left: e.clientX - dragOffset.x });
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleMouseDown = (e) => {
    if (modalRef.current) {
        setIsDragging(true);
        const modalRect = modalRef.current.getBoundingClientRect();
        setDragOffset({ x: e.clientX - modalRect.left, y: e.clientY - modalRect.top });
    }
  };

  useEffect(() => {
    const formatForInput = (date) => new Date(date).toISOString().slice(0, 16);
    if (isEditing && event) {
      setFormData({ title: event.title, description: event.description || '', startTime: formatForInput(event.startTime), endTime: formatForInput(event.endTime) });
      setSelectedAssignees(event.assignedTo ? event.assignedTo.map(m => m._id) : []);
    } else if (dateInfo) {
      setFormData({ title: '', description: '', startTime: formatForInput(dateInfo.startStr), endTime: formatForInput(dateInfo.endStr) });
      setSelectedAssignees([]);
    }
  }, [event, dateInfo, isEditing]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleAssigneeChange = (userId) => setSelectedAssignees(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventData = { ...formData, assignedTo: selectedAssignees, isAllDay: new Date(formData.startTime).toDateString() !== new Date(formData.endTime).toDateString() };
    if (isEditing) await updateEvent(event._id, eventData);
    else await createEvent(eventData);
    onClose();
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure?')) {
        await deleteEvent(event._id);
        onClose();
    }
  };

  const modalStyle = {
    position: 'absolute',
    top: `${currentPosition.top}px`,
    left: `${currentPosition.left}px`,
    width: '100%',
    maxWidth: '500px',
    zIndex: 1050,
    opacity: isPositioned ? 1 : 0,
    transform: isPositioned ? 'scale(1)' : 'scale(0.95)',
    // --- UPDATED: Conditionally apply transitions ---
    transition: `opacity 0.2s ease-out, transform 0.2s ease-out${isPositioned ? ', top 0.3s ease-out, left 0.3s ease-out' : ''}`,
  };

  const assigneeTagStyle = (color) => ({ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, padding: `${theme.spacing.xs} ${theme.spacing.sm}`, borderRadius: theme.borderRadius.medium, backgroundColor: color, color: theme.colors.neutralSurface, cursor: 'pointer', fontSize: theme.typography.caption.fontSize });

  return (
      <div ref={modalRef} style={modalStyle}>
        <Card>
          <div onMouseDown={handleMouseDown} style={{ cursor: 'move', paddingBottom: theme.spacing.md, borderBottom: `1px solid #eee`, marginBottom: theme.spacing.md }}>
              <h2 style={{ ...theme.typography.h3, color: theme.colors.textPrimary }}>{isEditing ? 'Edit Event' : 'Add Event'}</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <InputField label="Title" name="title" value={formData.title} onChange={handleChange} required />
            <InputField label="Start Time" name="startTime" type="datetime-local" value={formData.startTime} onChange={handleChange} required />
            <InputField label="End Time" name="endTime" type="datetime-local" value={formData.endTime} onChange={handleChange} required />
            <InputField label="Description" name="description" as="textarea" value={formData.description} onChange={handleChange} />
            <div style={{ marginBottom: theme.spacing.lg }}>
              <label style={{ ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.sm, display: 'block' }}>Assign to:</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing.sm }}>
                {familyMembers.map(member => (
                    <label key={member.userId._id} style={assigneeTagStyle(member.color)}>
                      <input type="checkbox" value={member.userId._id} checked={selectedAssignees.includes(member.userId._id)} onChange={() => handleAssigneeChange(member.userId._id)} style={{ marginRight: theme.spacing.xs }}/>
                      {member.userId.displayName}
                    </label>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: theme.spacing.lg }}>
              <div>{isEditing && <Button type="button" variant="danger" onClick={handleDelete}>Delete</Button>}</div>
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
