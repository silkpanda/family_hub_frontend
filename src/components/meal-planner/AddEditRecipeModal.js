import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';

const AddEditRecipeModal = ({ isOpen, onClose, recipeToEdit, onSave, onDelete }) => {
    const [formData, setFormData] = useState({ name: '', ingredients: '', instructions: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (recipeToEdit) {
                setFormData({
                    name: recipeToEdit.name || '',
                    ingredients: recipeToEdit.ingredients || '',
                    instructions: recipeToEdit.instructions || ''
                });
            } else {
                setFormData({ name: '', ingredients: '', instructions: '' });
            }
            setError('');
            setIsLoading(false);
        }
    }, [recipeToEdit, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // --- Detailed Logging ---
        console.log('[AddEditRecipeModal.js] - handleSubmit function called.');
        console.log('[AddEditRecipeModal.js] - Form Data:', formData);

        if (!formData.name.trim()) {
            setError('Recipe name is required.');
            return;
        }
        setIsLoading(true);
        setError('');

        try {
            await onSave(formData, recipeToEdit?._id);
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to save recipe.');
        } finally {
            setIsLoading(false);
        }
    };
     
    const handleDelete = () => {
        if (!recipeToEdit) return;
        onDelete(recipeToEdit._id);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={onClose}>
            <Card className="p-8 w-full max-w-lg mx-auto" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {recipeToEdit ? 'Edit Recipe' : 'Add New Recipe'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Recipe Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div>
                        <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">Ingredients</label>
                        <textarea name="ingredients" value={formData.ingredients} onChange={handleChange} rows="4" className="mt-1 w-full p-2 border border-gray-300 rounded-md"></textarea>
                    </div>
                    <div>
                        <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Instructions</label>
                        <textarea name="instructions" value={formData.instructions} onChange={handleChange} rows="6" className="mt-1 w-full p-2 border border-gray-300 rounded-md"></textarea>
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div className="flex justify-between items-center pt-4">
                        <div>
                            {recipeToEdit && (
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
                                {isLoading ? 'Saving...' : 'Save Recipe'}
                            </Button>
                        </div>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default AddEditRecipeModal;

