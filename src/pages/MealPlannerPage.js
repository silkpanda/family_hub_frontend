// ===================================================================================
// File: /src/pages/MealPlannerPage.js
// Purpose: The main page for the meal planning feature. It orchestrates the
// drag-and-drop functionality between the `RecipeBox` and the `MealPlanCalendar`.
// It uses `DndContext` to manage the global state of the drag-and-drop operations.
// ===================================================================================
import React, { useContext, useState } from 'react';
import RecipeBox from '../components/meals/RecipeBox';
import MealPlanCalendar from '../components/meals/MealPlanCalendar';
import DraggableRecipe from '../components/meals/DraggableRecipe';
import RecipePickerModal from '../components/meals/RecipePickerModal';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { MealContext } from '../context/MealContext';
import { theme } from '../theme/theme';

const MealPlannerPage = () => {
    const { actions } = useContext(MealContext);
    const { addRecipeToPlan } = actions;
    const [activeRecipe, setActiveRecipe] = useState(null); // The recipe currently being dragged.
    const [isPickerOpen, setIsPickerOpen] = useState(false); // State for the recipe picker modal.
    const [selectedSlot, setSelectedSlot] = useState(null); // The meal slot that was clicked.

    // --- Drag-and-Drop Handlers ---

    function handleDragStart(event) {
        // When a drag starts, get the recipe data from the event and store it in state.
        setActiveRecipe(event.active.data.current?.recipe);
    }

    function handleDragEnd(event) {
        const { over, active } = event;
        // When a drag ends, check if it was dropped over a valid meal slot.
        if (over && over.data.current?.isMealSlot) {
            const { date, mealType } = over.data.current;
            addRecipeToPlan({ recipeId: active.id, date, mealType });
        }
        // Clear the active recipe, which also hides the DragOverlay.
        setActiveRecipe(null);
    }

    // --- Click-to-Add Handlers (for mobile/touch) ---

    const handleSlotClick = (date, mealType) => {
        // When a meal slot is clicked, store its details and open the recipe picker modal.
        setSelectedSlot({ date, mealType });
        setIsPickerOpen(true);
    };

    const handleRecipeSelect = (recipeId) => {
        // When a recipe is selected from the picker, add it to the stored slot.
        if (selectedSlot) {
            addRecipeToPlan({ ...selectedSlot, recipeId });
        }
        setIsPickerOpen(false);
        setSelectedSlot(null);
    };

    const pageStyle = { fontFamily: theme.typography.fontFamily, color: theme.colors.textPrimary };

    return (
        // DndContext wraps the components that will participate in drag-and-drop.
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div style={pageStyle}>
                <h1 style={{ ...theme.typography.h1, marginBottom: theme.spacing.lg }}>Meal Planner</h1>
                <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: theme.spacing.xl }}>
                    {/* Main calendar view */}
                    <div><MealPlanCalendar onSlotClick={handleSlotClick} /></div>
                    {/* Recipe list */}
                    <div><RecipeBox /></div>
                </div>
            </div>
            
            {/* DragOverlay renders a "ghost" of the component being dragged, following the cursor. */}
            <DragOverlay>
                <div style={{ opacity: 0.8 }}>
                    {activeRecipe ? <DraggableRecipe recipe={activeRecipe} isDragging={true} /> : null}
                </div>
            </DragOverlay>

            {/* The recipe picker modal for non-drag-and-drop interactions. */}
            {isPickerOpen && (
                <RecipePickerModal 
                    onSelect={handleRecipeSelect} 
                    onClose={() => setIsPickerOpen(false)} 
                />
            )}
        </DndContext>
    );
};

export default MealPlannerPage;