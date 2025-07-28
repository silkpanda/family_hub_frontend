import React, { useContext } from 'react';
import RecipeBox from '../components/meals/RecipeBox';
import MealPlanCalendar from '../components/meals/MealPlanCalendar';
import { DndContext } from '@dnd-kit/core';
import { MealContext } from '../context/MealContext';
import { theme } from '../theme/theme';

const MealPlannerPage = () => {
    const { addRecipeToPlan } = useContext(MealContext);

    function handleDragEnd(event) {
        const { over, active } = event;

        if (over && over.data.current?.isDayCell) {
            const date = over.data.current.date;
            const recipeId = active.id;
            
            const mealType = prompt("What meal is this for? (e.g., Breakfast, Lunch, Dinner)");
            
            if (mealType && mealType.trim() !== '') {
                addRecipeToPlan({ recipeId, date, mealType });
            }
        }
    }

    const pageStyle = {
        fontFamily: theme.typography.fontFamily,
        color: theme.colors.textPrimary,
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div style={pageStyle}>
                <h1 style={{ ...theme.typography.h1, marginBottom: theme.spacing.lg }}>Meal Planner</h1>
                
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: theme.spacing.xl }}>
                    <div>
                        <MealPlanCalendar />
                    </div>
                    <div>
                        <RecipeBox />
                    </div>
                </div>
            </div>
        </DndContext>
    );
};

export default MealPlannerPage;
