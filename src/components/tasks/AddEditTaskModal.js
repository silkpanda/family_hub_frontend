import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const AddEditTaskModal = ({ isOpen, onClose, taskToEdit, taskType, onSave, householdMembers = [] }) => {
    const [formData, setFormData] = useState({ title: '', points: 10, assignedTo: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (taskToEdit) {
                setFormData({
                    title: taskToEdit.title || '',
                    points: taskToEdit.points || 10,
                    assignedTo: taskToEdit.assignedTo || []
                });
            } else {
                setFormData({ title: '', points: 10, assignedTo: [] });
            }
            setError('');
            setIsLoading(false);
        }
    }, [taskToEdit, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAssigneeChange = (memberId) => {
        setFormData(prev => {
            const currentlyAssigned = prev.assignedTo;
            if (currentlyAssigned.includes(memberId)) {
                return { ...prev, assignedTo: currentlyAssigned.filter(id => id !== memberId) };
            } else {
                return { ...prev, assignedTo: [...currentlyAssigned, memberId] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || formData.points < 0) {
            setError('Title is required and points must be a positive number.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const finalData = { ...formData, type: taskType };
            await onSave(finalData, taskToEdit?._id);
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to save task.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <Card className="w-full max-w-md p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-800 capitalize">{taskToEdit ? 'Edit' : 'Add New'} {taskType}</h2>
                    
                    {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="points" className="block text-sm font-medium text-gray-700">Points</label>
                        <input
                            type="number"
                            name="points"
                            id="points"
                            value={formData.points}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                            min="0"
                        />
                    </div>

                    {/* Updated Assignee Selection UI */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Assign to</label>
                        <div className="flex flex-wrap gap-4 p-2 bg-gray-50 rounded-lg">
                            {householdMembers.length > 0 ? (
                                householdMembers.map(member => {
                                    const isSelected = formData.assignedTo.includes(member.user._id);
                                    return (
                                        <div
                                            key={member.user._id}
                                            onClick={() => handleAssigneeChange(member.user._id)}
                                            className={`cursor-pointer flex flex-col items-center w-20 text-center transition-all duration-200 p-2 rounded-lg ${isSelected ? 'bg-indigo-100 ring-2 ring-indigo-500' : 'hover:bg-gray-200'}`}
                                        >
                                            <div className="relative">
                                                {member.user.image ? (
                                                    <img
                                                        src={member.user.image}
                                                        alt={member.user.displayName}
                                                        className="h-14 w-14 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-14 w-14 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-xl" style={{backgroundColor: member.color || '#cccccc'}}>
                                                        {member.user.displayName?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                {isSelected && (
                                                    <div className="absolute top-0 right-0 bg-indigo-600 rounded-full h-5 w-5 flex items-center justify-center text-white ring-2 ring-white">
                                                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-700 font-medium mt-2 truncate w-full">{member.user.displayName}</span>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-gray-500">No household members found.</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" onClick={onClose} variant="secondary" disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Task'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default AddEditTaskModal;

