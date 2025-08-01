// ===================================================================================
// File: /frontend/src/components/dashboard/DailyMealPlan.js
// Purpose: A stylized component to display the meals for the current day.
//
// --- Dev Notes (UPDATE) ---
// - BUG FIX: The component was always displaying "Not Planned" because it was
//   incorrectly trying to look up recipe details that were already present.
// - SOLUTION: The `findRecipeForMeal` function has been simplified. The `mealPlan`
//   object from the context already contains the fully populated recipe object, so
//   we can now use it directly instead of searching the `allRecipes` array.
// - DEBUGGING: Added a console.log to show the props being received by this
//   component to aid in any future debugging.
// ===================================================================================
import React from 'react';
import { theme } from '../../theme/theme';
import Card from '../shared/Card';

const MealCard = ({ mealType, recipe }) => {
    const cardStyle = {
        flex: 1,
        minWidth: '200px',
        textAlign: 'center',
    };
    const mealTypeStyle = {
        ...theme.typography.caption,
        fontWeight: 'bold',
        color: theme.colors.textSecondary,
        textTransform: 'uppercase',
    };
    const recipeNameStyle = {
        ...theme.typography.h4,
        color: theme.colors.primaryBrand,
        marginTop: theme.spacing.sm,
    };
    const notPlannedStyle = {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.sm,
    };

    return (
        <Card style={cardStyle}>
            <p style={mealTypeStyle}>{mealType}</p>
            {recipe ? (
                <p style={recipeNameStyle}>{recipe.name}</p>
            ) : (
                <p style={notPlannedStyle}>Not Planned</p>
            )}
        </Card>
    );
};

const DailyMealPlan = ({ meals, allRecipes }) => {
    const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'];

    // --- NEW LOG for debugging ---
    console.log('[DEBUG] DailyMealPlan Component Props:', { meals, allRecipes });

    // --- UPDATED ---
    // This function now correctly extracts the recipe object.
    const findRecipeForMeal = (mealType) => {
        const meal = meals.find(m => m.mealType.toLowerCase() === mealType.toLowerCase());
        // The `meal.recipeId` field is already the populated recipe object from the backend.
        return meal ? meal.recipeId : null;
    };

    return (
        <div style={{ display: 'flex', gap: theme.spacing.lg, flexWrap: 'wrap' }}>
            {MEAL_TYPES.map(mealType => (
                <MealCard
                    key={mealType}
                    mealType={mealType}
                    recipe={findRecipeForMeal(mealType)}
                />
            ))}
        </div>
    );
};

export default DailyMealPlan;
