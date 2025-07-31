// ===================================================================================
// File: /frontend/src/components/dashboard/DailyMealPlan.js
// Purpose: A stylized component to display the meals for the current day.
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

    const findRecipeForMeal = (mealType) => {
        const meal = meals.find(m => m.mealType.toLowerCase() === mealType.toLowerCase());
        if (!meal) return null;
        return allRecipes.find(r => r._id === meal.recipeId);
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
