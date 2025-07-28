import React, { useContext, useEffect, useState } from 'react';
import { MealContext } from '../../context/MealContext';
import { useDraggable } from '@dnd-kit/core';
import RecipeModal from './RecipeModal';
import { theme } from '../../theme/theme';
import Card from '../shared/Card';
import Button from '../shared/Button';

// --- CORRECTED ---
// The DraggableRecipe component is now defined OUTSIDE of the RecipeBox component.
// This ensures it is only created once and is stable across re-renders.
const DraggableRecipe = ({ recipe }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: recipe._id,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 10,
    } : undefined;

    return (
        <Card ref={setNodeRef} style={{...style, cursor: 'grab'}} {...listeners} {...attributes}>
            <h3 style={{ ...theme.typography.body, fontWeight: '600' }}>{recipe.name}</h3>
            <p style={{ ...theme.typography.caption, color: theme.colors.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{recipe.description || 'No description'}</p>
        </Card>
    );
};

const RecipeBox = () => {
  const { recipes, fetchRecipes } = useContext(MealContext);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md }}>
        <h2 style={{ ...theme.typography.h3 }}>Recipe Box</h2>
        <Button variant="secondary" onClick={() => setIsCreateModalOpen(true)}>
          + Add Recipe
        </Button>
      </div>
      <p style={{ ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.md }}>Drag a recipe onto a day to plan your meal.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md, maxHeight: '70vh', overflowY: 'auto' }}>
        {recipes.map(recipe => (
          <DraggableRecipe key={recipe._id} recipe={recipe} />
        ))}
      </div>
      
      {isCreateModalOpen && <RecipeModal isCreating={true} onClose={() => setIsCreateModalOpen(false)} />}
    </Card>
  );
};

export default RecipeBox;
