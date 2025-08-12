// --- File: /frontend/src/pages/MealPlannerPage.js ---
// The main page for the meal planner, featuring a drag-and-drop interface.

import React, { useState } from 'react';
import RecipeBox from '../components/meals/RecipeBox';
import MealPlanCalendar from '../components/meals/MealPlanCalendar';
import DraggableRecipe from '../components/meals/DraggableRecipe';
import RecipePickerModal from '../components/meals/RecipePickerModal';
import { DndContext, DragOverlay } from '@dnd-kit/core'; // Drag and drop library.
import { useMeals } from '../context/MealContext';
import { theme } from '../theme/theme';

const MealPlannerPage = () => {
    const { actions } = useMeals();
    const { addRecipeToPlan } = actions;
    const [activeRecipe, setActiveRecipe] = useState(null); // The recipe currently being dragged.
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    function handleDragStart(event) { setActiveRecipe(event.active.data.current?.recipe); }
    function handleDragEnd(event) { 
        const { over, active } = event; 
        if (over && over.data.current?.isMealSlot) { // Check if dropped on a valid meal slot.
            const { date, mealType } = over.data.current; 
            if(addRecipeToPlan) addRecipeToPlan({ recipeId: active.id, date, mealType }); 
        } 
        setActiveRecipe(null); 
    }
    
    // handleSlotClick: Opens a modal to pick a recipe when a slot is clicked.
    const handleSlotClick = (date, mealType) => { 
        setSelectedSlot({ date, mealType }); 
        setIsPickerOpen(true); 
    };
    
    const handleRecipeSelect = (recipeId) => { 
        if (selectedSlot && addRecipeToPlan) { 
            addRecipeToPlan({ ...selectedSlot, recipeId }); 
        } 
        setIsPickerOpen(false); 
        setSelectedSlot(null); 
    };
    
    const pageStyle = { fontFamily: theme.typography.fontFamily, color: theme.colors.textPrimary, padding: theme.spacing.lg };
    
    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div style={pageStyle}>
                <h1 style={{ ...theme.typography.h1, marginBottom: theme.spacing.lg }}>Meal Planner</h1>
                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xl }}>
                    <div><MealPlanCalendar onSlotClick={handleSlotClick} /></div>
                    <div><RecipeBox /></div>
                </div>
            </div>
            <DragOverlay><div style={{ opacity: 0.8 }}>{activeRecipe ? <DraggableRecipe recipe={activeRecipe} isDragging={true} /> : null}</div></DragOverlay>
            {isPickerOpen && (<RecipePickerModal onSelect={handleRecipeSelect} onClose={() => setIsPickerOpen(false)} />)}
        </DndContext>
    );
};
export default MealPlannerPage;