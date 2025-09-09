import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

// The component no longer imports or uses any context.
// It receives an onSave function via props to handle data operations.
const AddEditRewardModal = ({ isOpen, onClose, rewardToEdit, onSave }) => {
    const [formData, setFormData] = useState({ name: '', description: '', cost: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (rewardToEdit) {
                setFormData({
                    name: rewardToEdit.name || '',
                    description: rewardToEdit.description || '',
                    cost: rewardToEdit.cost || 0
                });
            } else {
                setFormData({ name: '', description: '', cost: 100 });
            }
            setError('');
            setIsLoading(false);
        }
    }, [rewardToEdit, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || formData.cost < 0) {
            setError('Name is required and cost must be a positive number.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            // Use the onSave prop to add or update the reward
            await onSave(formData, rewardToEdit?._id);
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to save reward.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <Card className="w-full max-w-md p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-800">{rewardToEdit ? 'Edit Reward' : 'Add New Reward'}</h2>
                    
                    {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Reward Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="cost" className="block text-sm font-medium text-gray-700">Point Cost</label>
                        <input
                            type="number"
                            name="cost"
                            id="cost"
                            value={formData.cost}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                            min="0"
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <Button type="button" onClick={onClose} variant="secondary" disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Reward'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default AddEditRewardModal;
