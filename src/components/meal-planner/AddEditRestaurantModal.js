import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';

// The modal no longer uses useContext. It now receives functions as props.
const AddEditRestaurantModal = ({ 
    isOpen, 
    onClose, 
    restaurantToEdit,
    onSave, // New prop to handle saving
    onDelete, // New prop to handle deleting
}) => {
    const [formData, setFormData] = useState({ name: '', details: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (restaurantToEdit) {
                setFormData({ 
                    name: restaurantToEdit.name || '', 
                    details: restaurantToEdit.details || '' 
                });
            } else {
                setFormData({ name: '', details: '' });
            }
            setError('');
            setIsLoading(false);
        }
    }, [restaurantToEdit, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setError('Restaurant name is required.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            // Call the onSave function passed in via props
            await onSave(formData, restaurantToEdit?._id);
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to save restaurant.');
        } finally {
            setIsLoading(false);
        }
    };
     
    const handleDelete = async () => {
        if (!restaurantToEdit) return;
        setIsLoading(true);
        try {
            // Call the onDelete function passed in via props
            await onDelete(restaurantToEdit._id);
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to delete restaurant.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-auto" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {restaurantToEdit ? 'Edit Restaurant' : 'Add Favorite Restaurant'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Restaurant Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div>
                        <label htmlFor="details" className="block text-sm font-medium text-gray-700">Details (e.g., favorite dish, address)</label>
                        <textarea name="details" value={formData.details} onChange={handleChange} rows="4" className="mt-1 w-full p-2 border border-gray-300 rounded-md"></textarea>
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div className="flex justify-between items-center pt-4">
                        <div>
                            {restaurantToEdit && (
                                <Button type="button" onClick={handleDelete} disabled={isLoading} variant="danger">
                                    Delete
                                </Button>
                            )}
                        </div>
                        <div className="flex space-x-4">
                            <Button type="button" onClick={onClose} variant="secondary">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading} variant="primary">
                                {isLoading ? 'Saving...' : 'Save Restaurant'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditRestaurantModal;
