// --- File: /frontend/src/components/store/AddItemModal.js ---
// A modal for adding a new reward item to the store.

import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { theme } from '../../theme/theme';
import Card from '../shared/Card';
import Button from '../shared/Button';
import InputField from '../shared/InputField';

const AddItemModal = ({ onClose }) => {
    const { actions } = useStore();
    const { createItem } = actions;
    const [formData, setFormData] = useState({ name: '', description: '', cost: 100 });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (createItem) {
            createItem({ ...formData, cost: Number(formData.cost) });
        }
        onClose();
    };

    const modalOverlayStyle = {
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    };

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <Card style={{ width: '100%', maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <h2 style={theme.typography.h3}>Add New Reward</h2>
                    <InputField label="Reward Name" name="name" value={formData.name} onChange={handleChange} required />
                    <InputField label="Description" name="description" value={formData.description} onChange={handleChange} />
                    <InputField label="Point Cost" name="cost" type="number" value={formData.cost} onChange={handleChange} required />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: theme.spacing.md, marginTop: theme.spacing.lg }}>
                        <Button type="button" variant="tertiary" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="primary">Add Reward</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default AddItemModal;