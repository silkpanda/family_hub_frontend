// --- File: /frontend/src/components/meals/RecipeBox.js ---
// A container for all available recipes, allowing users to add new ones.

import React, { useState } from 'react';
import { useMeals } from '../../context/MealContext';
import DraggableRecipe from './DraggableRecipe';
import RecipeModal from './RecipeModal';
import { theme } from '../../theme/theme';
import Card from '../shared/Card';
import Button from '../shared/Button';

const RecipeBox = () => {
  const { state } = useMeals();
  const { recipes, recipesLoading } = state;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md }}>
        <h2 style={{ ...theme.typography.h3 }}>Recipe Box</h2>
        <Button variant="secondary" onClick={() => setIsCreateModalOpen(true)}>+ Add Recipe</Button>
      </div>
      <p style={{ ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.md }}>Drag a recipe onto a day to plan your meal.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md, maxHeight: '70vh', overflowY: 'auto' }}>
        {recipesLoading ? (<p style={{ textAlign: 'center', color: theme.colors.textSecondary }}>Loading recipes...</p>) : (recipes && recipes.map(recipe => <DraggableRecipe key={recipe._id} recipe={recipe} />))}
      </div>
      {isCreateModalOpen && <RecipeModal isCreating={true} onClose={() => setIsCreateModalOpen(false)} />}
    </Card>
  );
};
export default RecipeBox;