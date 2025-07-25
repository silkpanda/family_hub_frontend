import React, { useContext } from 'react';
import RecipeBox from '../components/meals/RecipeBox';
import MealPlanCalendar from '../components/meals/MealPlanCalendar';
import { DndContext } from '@dnd-kit/core';
import { MealContext } from '../context/MealContext';

const MealPlannerPage = () => {
    const { addRecipeToPlan } = useContext(MealContext);

    // This function handles the logic when a drag action is completed.
    function handleDragEnd(event) {
        const { over, active } = event;

        // Ensure the recipe was dropped onto a valid day cell
        if (over && over.data.current?.isDayCell) {
            const date = over.data.current.date;
            const recipeId = active.id;
            
            // Prompt the user to specify the meal type
            const mealType = prompt("What meal is this for? (e.g., Breakfast, Lunch, Dinner)");
            
            if (mealType && mealType.trim() !== '') {
                addRecipeToPlan({ recipeId, date, mealType });
            }
        }
    }

    return (
        // The DndContext provider wraps the components that will participate in drag-and-drop
        <DndContext onDragEnd={handleDragEnd}>
            <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Meal Planner</h1>
                
                {/* The page is now laid out with the calendar on the left and the recipe box on the right */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
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
