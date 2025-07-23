import React, { useState, useContext, useEffect } from 'react';
import { CalendarContext } from '../../context/CalendarContext';

const EventModal = ({ event, dateInfo, onClose }) => {
  const { addEvent, updateEvent, deleteEvent } = useContext(CalendarContext);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
  });
  
  const isEditing = event !== null;

  useEffect(() => {
    if (isEditing) {
      // Format dates for the datetime-local input
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
        // Convert back to full ISO string for the backend
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Event' : 'Add Event'}</h2>
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
          </div>
          <div className="mb-4">
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
            <input type="datetime-local" name="startTime" id="startTime" value={formData.startTime} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
          </div>
          <div className="mb-4">
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
            <input type="datetime-local" name="endTime" id="endTime" value={formData.endTime} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" id="description" rows="3" value={formData.description} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-6">
            <div>
                {isEditing && (
                    <button type="button" onClick={handleDelete} className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700">
                        Delete
                    </button>
                )}
            </div>
            <div>
                <button type="button" onClick={onClose} className="mr-2 bg-gray-200 py-2 px-4 rounded-md hover:bg-gray-300">
                    Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                    {isEditing ? 'Save Changes' : 'Create Event'}
                </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
