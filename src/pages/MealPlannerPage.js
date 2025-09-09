import React, { useContext, useState } from 'react';
import { MealPlannerContext } from '../context/MealPlannerContext';
import RecipeLibrary from '../components/meal-planner/RecipeLibrary';
import RestaurantLibrary from '../components/meal-planner/RestaurantLibrary';
import MealCalendar from '../components/meal-planner/MealCalendar';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import Card from '../components/ui/Card';

// A simple component for the drag overlay preview
const ItemPreview = ({ item, dimensions }) => {
    if (!item || !dimensions) return null;
    return (
        <div
            style={{ width: dimensions.width, height: dimensions.height }}
            className="p-3 rounded-lg flex justify-between items-center bg-gray-100"
        >
            <span className="font-semibold text-gray-800">{item.name}</span>
        </div>
    );
};

const MealPlannerPage = () => {
    const { loading, mealPlan, recipes, restaurants, updateMealPlan } = useContext(MealPlannerContext);
    const [activeId, setActiveId] = useState(null);
    // State to hold the dimensions of a single calendar slot
    const [calendarSlotDimensions, setCalendarSlotDimensions] = useState(null);

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null); // Clear the active item

        // Exit if not dropped on a valid droppable area
        if (!over) {
            return;
        }

        // The active.id is formatted as "type-id" (e.g., "recipe-someObjectId")
        const [type, itemId] = active.id.split('-');
        // The over.id is formatted as "date|mealType" (e.g., "2023-10-27|Breakfast")
        const [date, mealType] = over.id.split('|');

        // Create a deep copy of the current meal plan to avoid direct state mutation
        const newMealPlan = JSON.parse(JSON.stringify(mealPlan.plan || {}));
        if (!newMealPlan[date]) {
            newMealPlan[date] = {};
        }

        // Assign the new meal item to the correct day and meal type
        newMealPlan[date][mealType] = { type, itemId };

        // Call the context function to update the state and notify the backend
        updateMealPlan(newMealPlan);
    };

    // Find the full item object for the preview overlay
    const activeItem = activeId
        ? (activeId.startsWith('recipe')
            ? recipes.find(r => `recipe-${r._id}` === activeId)
            : restaurants.find(r => `restaurant-${r._id}` === activeId))
        : null;


    if (loading) {
        return <div className="flex justify-center items-center p-10"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div></div>;
    }

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="space-y-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Meal Planner</h2>
                    <p className="text-gray-600 mt-1">
                        Plan your family's meals for the week. Drag and drop recipes or restaurants onto the calendar.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <RecipeLibrary />
                        <RestaurantLibrary />
                    </div>

                    <div className="lg:col-span-3">
                        <Card className="p-4">
                            <h3 className="text-xl font-bold text-gray-700 mb-4 text-center">This Week's Plan</h3>
                            {/* Pass the callback to get the calendar slot dimensions */}
                            <MealCalendar 
                                mealPlan={mealPlan.plan || {}} 
                                recipes={recipes} 
                                restaurants={restaurants} 
                                onDimensionsChange={setCalendarSlotDimensions}
                            />
                        </Card>
                    </div>
                </div>
            </div>

            {/* This overlay renders the custom, shrunken preview that follows the cursor */}
            <DragOverlay>
                {activeId ? <ItemPreview item={activeItem} dimensions={calendarSlotDimensions} /> : null}
            </DragOverlay>
        </DndContext>
    );
};

export default MealPlannerPage;
