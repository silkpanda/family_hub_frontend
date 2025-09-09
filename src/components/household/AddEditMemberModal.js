import React, { useState, useEffect, useContext } from 'react';
import { ModalContext } from '../../context/ModalContext';
import { HouseholdContext } from '../../context/HouseholdContext';
import Card from '../ui/Card';
import Button from '../ui/Button';

const AddEditMemberModal = ({ isOpen, onClose, onSave, memberToEdit }) => {
    const { showModal } = useContext(ModalContext);
    const { householdData, updateMemberColor } = useContext(HouseholdContext);

    const [displayName, setDisplayName] = useState('');
    const [role, setRole] = useState('child');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const currentMemberData = memberToEdit 
        ? householdData.household?.members.find(m => m.user._id === memberToEdit.user._id) 
        : null;

    useEffect(() => {
        if (isOpen) {
            if (currentMemberData) {
                setDisplayName(currentMemberData.user.displayName);
                setRole(currentMemberData.user.role);
            } else {
                setDisplayName('');
                setRole('child');
            }
            setError('');
            setIsLoading(false);
        }
    }, [currentMemberData, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!displayName.trim()) {
            setError('Display name cannot be empty.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            await onSave({ displayName, role });
            onClose();
        } catch (err) {
            setError(err.message || 'An error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const openColorPicker = () => {
        if (!currentMemberData) return;
        showModal('colorPicker', {
            memberName: currentMemberData.user.displayName,
            onColorSelect: (color) => {
                updateMemberColor(currentMemberData.user._id, color);
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={onClose}>
            <Card className="p-8 w-full max-w-md mx-auto" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {currentMemberData ? 'Edit Member' : 'Add New Member'}
                </h2>
                 
                {currentMemberData && (
                    <div className="flex justify-center mb-6">
                        <button onClick={openColorPicker} className="relative group">
                            <div 
                                className="h-24 w-24 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: currentMemberData.color }}
                            >
                                <span className="text-4xl font-bold text-white">{currentMemberData.user.displayName.charAt(0).toUpperCase()}</span>
                            </div>
                            <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-opacity">
                                <p className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100">Change Color</p>
                            </div>
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">Display Name</label>
                        <input type="text" id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" required />
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                        <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md">
                            <option value="child">Child</option>
                            <option value="parent">Parent</option>
                        </select>
                    </div>
                     {error && <p className="text-sm text-red-600">{error}</p>}
                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="button" onClick={onClose} variant="secondary">Cancel</Button>
                        <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default AddEditMemberModal;