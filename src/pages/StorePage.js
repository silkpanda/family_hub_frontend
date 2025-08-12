// --- File: /frontend/src/pages/StorePage.js ---
// Displays the rewards store where users can redeem points.

import React, { useState, useContext } from 'react';
import { useStore } from '../context/StoreContext';
import { useFamily } from '../context/FamilyContext';
import { AuthContext } from '../context/AuthContext';
import { theme } from '../theme/theme';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import AddItemModal from '../components/store/AddItemModal';

const StoreItemCard = ({ item, userPoints }) => {
    const canAfford = userPoints >= item.cost;
    return (
        <Card style={{ textAlign: 'center' }}>
            <h3 style={theme.typography.h3}>{item.name}</h3>
            <p style={{ ...theme.typography.h2, color: theme.colors.secondaryBrand, margin: `${theme.spacing.md} 0` }}>{item.cost} pts</p>
            <p style={{ ...theme.typography.caption, color: theme.colors.textSecondary, minHeight: '40px' }}>{item.description}</p>
            <Button variant="primary" disabled={!canAfford} style={{ marginTop: theme.spacing.md }}>
                {canAfford ? 'Redeem' : 'Not Enough Points'}
            </Button>
        </Card>
    );
};

const StorePage = () => {
    const { state: storeState } = useStore();
    const { state: familyState } = useFamily();
    const { user } = useContext(AuthContext);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const currentUser = familyState.family?.members.find(m => m.userId._id === user.id);
    const isParent = currentUser?.role === 'Parent/Guardian';
    const userPoints = 100; // Placeholder for user points.

    return (
        <div style={{ fontFamily: theme.typography.fontFamily, padding: theme.spacing.lg }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg }}>
                <h1 style={theme.typography.h1}>Rewards Store</h1>
                {isParent && (
                    <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>+ Add Reward</Button>
                )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: theme.spacing.lg }}>
                {storeState.items.map(item => (
                    <StoreItemCard key={item._id} item={item} userPoints={userPoints} />
                ))}
            </div>
            {isAddModalOpen && <AddItemModal onClose={() => setIsAddModalOpen(false)} />}
        </div>
    );
};

export default StorePage;