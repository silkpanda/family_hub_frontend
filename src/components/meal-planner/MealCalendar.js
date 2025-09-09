import React, { useRef, useEffect, forwardRef } from 'react';
import { useDroppable } from '@dnd-kit/core';

// Helper function to format a date object into "YYYY-MM-DD" string
const toISODateString = (date) => {
    return date.toISOString().split('T')[0];
};

// This component displays the meal for a specific slot (e.g., Breakfast on Monday)
const MealItem = ({ meal, recipes, restaurants }) => {
    if (!meal) return null; // Return nothing if the slot is empty

    // Find the full item details from the libraries based on the meal's type and ID
    const item = meal.type === 'recipe'
        ? recipes.find(r => r._id === meal.itemId)
        : restaurants.find(r => r._id === meal.itemId);

    if (!item) return <div className="p-2 text-xs text-red-500">Item not found</div>;

    // A small, non-draggable card to display the planned meal
    return (
        <div className="p-2 bg-indigo-100 text-indigo-800 rounded-md text-sm font-semibold shadow-sm">
            {item.name}
        </div>
    );
};

// A new component for each droppable day/meal slot in the calendar.
const DroppableSlot = forwardRef(({ date, mealType, meal, recipes, restaurants }, ref) => {
    const droppableId = `${toISODateString(date)}|${mealType}`;
    const { isOver, setNodeRef } = useDroppable({
        id: droppableId,
    });
    
    // Combine the forwarded ref with the dnd-kit ref
    const combinedRef = (node) => {
        setNodeRef(node);
        if (ref) {
            if (typeof ref === 'function') {
                ref(node);
            } else {
                ref.current = node;
            }
        }
    };

    return (
        <div
            ref={combinedRef}
            // Conditionally style the slot when an item is being dragged over it.
            className={`p-2 rounded-lg h-24 flex flex-col ${isOver ? 'bg-green-100' : 'bg-gray-50'}`}
        >
            <MealItem meal={meal} recipes={recipes} restaurants={restaurants} />
            <div className="flex-grow"></div>
            <div className="text-xs text-center text-gray-400 font-semibold pt-1">{mealType}</div>
        </div>
    );
});


// The main component for the weekly meal calendar
const MealCalendar = ({ mealPlan, recipes, restaurants, onDimensionsChange }) => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      
    const weekDates = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(date.getDate() + i);
        return date;
    });

    const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];

    // Ref to measure the dimensions of the first slot
    const firstSlotRef = useRef(null);

    // Effect to measure the first slot and report back to the parent component
    useEffect(() => {
        // This effect now runs whenever the component mounts OR when the meal plan changes.
        // This ensures that after a drop causes a re-render, we re-capture the slot dimensions.
        // This can resolve subtle timing issues where the layout measurement might be lost or stale
        // across renders triggered by parent state updates.
        if (firstSlotRef.current && onDimensionsChange) {
            const rect = firstSlotRef.current.getBoundingClientRect();
            onDimensionsChange({ width: rect.width, height: rect.height });
        }
        // By adding `mealPlan` to the dependency array, we ensure the dimensions are
        // re-calculated after a successful drop updates the plan.
    }, [onDimensionsChange, mealPlan]);

    return (
        <div className="grid grid-cols-7 gap-2">
            {/* Header row for the days of the week */}
            {weekDates.map(date => (
                <div key={date.toString()} className="text-center font-bold text-gray-600 pb-2 border-b-2 border-gray-200">
                    <div>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div className="text-sm text-gray-400">{date.getDate()}</div>
                </div>
            ))}

            {/* Grid for the meal slots (Breakfast, Lunch, Dinner for each day) */}
            {mealTypes.map(mealType => (
                <React.Fragment key={mealType}>
                    {weekDates.map((date, index) => {
                        const dateString = toISODateString(date);
                        const meal = mealPlan[dateString]?.[mealType];
                        
                        // Attach the ref to the first slot to measure its dimensions
                        const isFirstSlot = index === 0 && mealType === 'Breakfast';
                        const ref = isFirstSlot ? firstSlotRef : null;

                        return (
                            <DroppableSlot
                                key={`${dateString}|${mealType}`}
                                date={date}
                                mealType={mealType}
                                meal={meal}
                                recipes={recipes}
                                restaurants={restaurants}
                                ref={ref}
                            />
                        );
                    })}
                </React.Fragment>
            ))}
        </div>
    );
};

export default MealCalendar;