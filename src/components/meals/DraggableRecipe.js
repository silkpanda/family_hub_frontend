// --- File: /frontend/src/components/meals/DraggableRecipe.js ---
// A draggable version of a recipe card for use in the meal planner.

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import Card from '../shared/Card';
import { theme } from '../../theme/theme';

const DraggableRecipe = ({ recipe, isDragging = false }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: recipe._id, data: { recipe } });
    const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, ...(isDragging && { zIndex: 1000, boxShadow: theme.shadows.medium }) } : undefined;
    
    return (
        <Card ref={setNodeRef} style={{...style, cursor: isDragging ? 'grabbing' : 'grab'}} {...listeners} {...attributes}>
            <h3 style={{ ...theme.typography.body, fontWeight: '600' }}>{recipe.name}</h3>
            <p style={{ ...theme.typography.caption, color: theme.colors.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{recipe.description || 'No description'}</p>
        </Card>
    );
};
export default DraggableRecipe;