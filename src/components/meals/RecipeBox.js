// ===================================================================================
// File: /src/components/meals/RecipeBox.js
// Purpose: Displays a list of all available recipes that users can drag onto the
// meal plan calendar. It also includes a button to open a modal for creating a new recipe.
// ===================================================================================
import React, { useContext, useEffect, useState } from 'react';
import { MealContext } from '../../context/MealContext';
import DraggableRecipe from './DraggableRecipe';
import RecipeModal from './RecipeModal';
import { theme } from '../../theme/theme';
import Card from '../shared/Card';
import Button from '../shared/Button';

/**
 * A component that displays a scrollable list of draggable recipes.
 */
const RecipeBox = () => {
  const { state, actions } = useContext(MealContext);
  const { recipes, recipesLoading } = state;
  const { fetchRecipes } = actions;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch all recipes when the component mounts.
  useEffect(() => { fetchRecipes(); }, [fetchRecipes]);

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md }}>
        <h2 style={{ ...theme.typography.h3 }}>Recipe Box</h2>
        <Button variant="secondary" onClick={() => setIsCreateModalOpen(true)}>+ Add Recipe</Button>
      </div>
      <p style={{ ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.md }}>
        Drag a recipe onto a day to plan your meal.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md, maxHeight: '70vh', overflowY: 'auto' }}>
        {recipesLoading ? (
            <p style={{ textAlign: 'center', color: theme.colors.textSecondary }}>Loading recipes...</p>
        ) : (
            recipes && recipes.map(recipe => <DraggableRecipe key={recipe._id} recipe={recipe} />)
        )}
      </div>
      {/* The RecipeModal is rendered conditionally when isCreateModalOpen is true. */}
      {isCreateModalOpen && <RecipeModal isCreating={true} onClose={() => setIsCreateModalOpen(false)} />}
    </Card>
  );
};

export default RecipeBox;