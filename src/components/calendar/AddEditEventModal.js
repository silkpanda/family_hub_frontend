import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';

const AddEditEventModal = ({ isOpen, onClose, onSave, onDelete, eventToEdit, selectedDate }) => {
    const [formData, setFormData] = useState({ title: '', start: '', end: '', allDay: false });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            const initialStart = selectedDate ? new Date(selectedDate) : new Date();
            const initialEnd = selectedDate ? new Date(selectedDate) : new Date();
            initialEnd.setHours(initialStart.getHours() + 1);

            if (eventToEdit) {
                setFormData({
                    title: eventToEdit.title || '',
                    start: new Date(eventToEdit.start).toISOString().slice(0, 16),
                    end: new Date(eventToEdit.end).toISOString().slice(0, 16),
                    allDay: eventToEdit.allDay || false,
                });
            } else {
                setFormData({
                    title: '',
                    start: initialStart.toISOString().slice(0, 16),
                    end: initialEnd.toISOString().slice(0, 16),
                    allDay: false,
                });
            }
            setError('');
            setIsLoading(false);
        }
    }, [eventToEdit, selectedDate, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            setError('Title is required.');
            return;
        }
        setIsLoading(true);
        setError('');
        const eventData = { ...formData, start: new Date(formData.start), end: new Date(formData.end) };
        try {
            await onSave(eventData, eventToEdit ? eventToEdit._id : null);
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to save event.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = () => {
        // --- Detailed Logging ---
        console.log('[AddEditEventModal.js] - handleDelete function called.');
        if (onDelete && eventToEdit) {
            onDelete(eventToEdit._id);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={onClose}>
            <Card className="p-8 w-full max-w-lg mx-auto" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{eventToEdit ? 'Edit Event' : 'Add New Event'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="start" className="block text-sm font-medium text-gray-700">Start Time</label>
                            <input type="datetime-local" name="start" value={formData.start} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md" disabled={formData.allDay} />
                        </div>
                        <div>
                            <label htmlFor="end" className="block text-sm font-medium text-gray-700">End Time</label>
                            <input type="datetime-local" name="end" value={formData.end} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md" disabled={formData.allDay} />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" name="allDay" checked={formData.allDay} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
                        <label htmlFor="allDay" className="ml-2 block text-sm text-gray-900">All Day Event</label>
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div className="flex justify-between items-center pt-4">
                        <div>
                            {eventToEdit && (
                                <Button type="button" onClick={handleDelete} disabled={isLoading} variant="dangerLink">
                                    Delete Event
                                </Button>
                            )}
                        </div>
                        <div className="flex space-x-4">
                            <Button type="button" onClick={onClose} variant="secondary">Cancel</Button>
                            <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Event'}</Button>
                        </div>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default AddEditEventModal;

