// ===================================================================================
// File: /src/components/meals/DraggableRecipe.js
// Purpose: A component that represents a single recipe that can be dragged. It uses
// the `useDraggable` hook from `@dnd-kit/core` to enable drag-and-drop functionality.
// This component is used in the RecipeBox.
// ===================================================================================
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import Card from '../shared/Card';
import { theme } from '../../theme/theme';

/**
 * A draggable card representing a recipe.
 * @param {object} props - Component props.
 * @param {object} props.recipe - The recipe data to display.
 * @param {boolean} [props.isDragging=false] - Indicates if the component is being rendered in a DragOverlay.
 */
const DraggableRecipe = ({ recipe, isDragging = false }) => {
    // `useDraggable` provides the necessary attributes, listeners, and transform styles.
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: recipe._id, // The unique ID for this draggable item.
        data: { recipe } // Pass the recipe data along with the drag event.
    });

    // Apply a CSS transform if the item is being dragged.
    const style = transform 
        ? { 
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
            // Apply a z-index and shadow when dragging to lift it above other elements.
            ...(isDragging && { zIndex: 1000, boxShadow: theme.shadows.medium }) 
          } 
        : undefined;

    return (
        <Card 
            ref={setNodeRef} // Assign the ref to the draggable node.
            style={{...style, cursor: isDragging ? 'grabbing' : 'grab'}} // Change cursor style while dragging.
            {...listeners} // Attach event listeners (onMouseDown, onTouchStart).
            {...attributes} // Attach accessibility attributes.
        >
            <h3 style={{ ...theme.typography.body, fontWeight: '600' }}>{recipe.name}</h3>
            <p style={{ ...theme.typography.caption, color: theme.colors.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {recipe.description || 'No description'}
            </p>
        </Card>
    );
};

export default DraggableRecipe;