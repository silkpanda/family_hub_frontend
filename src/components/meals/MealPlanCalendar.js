// ===================================================================================
// File: /src/components/meals/MealPlanCalendar.js
// Purpose: Displays the weekly meal plan in a calendar-style grid. Each day has
// slots for Breakfast, Lunch, and Dinner. These slots are "droppable" targets for
// recipes, and they also show currently planned meals.
// ===================================================================================
import React, { useContext, useEffect, useState } from 'react';
import { MealContext } from '../../context/MealContext';
import { useDroppable } from '@dnd-kit/core';
import { theme } from '../../theme/theme';
import Card from '../shared/Card';

/**
 * Generates an array of Date objects for the current week, starting from Sunday.
 * @returns {Date[]} An array of 7 Date objects.
 */
const getWeekDates = () => {
  const today = new Date();
  // Set to the most recent Sunday.
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  return dates;
};

/**
 * Represents a single meal slot (e.g., Tuesday's Lunch) in the calendar.
 * It's a droppable area for recipes.
 * @param {object} props - Component props.
 * @param {Date} props.date - The date for this slot.
 * @param {string} props.mealType - The type of meal (e.g., "Breakfast").
 * @param {object|null} props.recipe - The recipe planned for this slot, if any.
 * @param {function} props.onSlotClick - Function to call when the slot is clicked.
 */
const MealSlot = ({ date, mealType, recipe, onSlotClick }) => {
    const { actions } = useContext(MealContext);
    const { removeRecipeFromPlan } = actions;
    // `useDroppable` makes this component a target for draggable items.
    const { isOver, setNodeRef } = useDroppable({
        id: `${date.toISOString()}-${mealType}`, // Unique ID for the droppable area.
        data: { date, mealType, isMealSlot: true } // Pass metadata with the drop event.
    });

    const handleRemove = (e) => {
        e.stopPropagation(); // Prevent the onSlotClick from firing.
        if (window.confirm(`Are you sure you want to remove ${recipe.name} from the plan?`)) {
            removeRecipeFromPlan({ recipeId: recipe._id, date, mealType });
        }
    };

    // Style the slot to give visual feedback when a draggable is over it.
    const slotStyle = { 
        border: `2px dashed ${isOver ? theme.colors.primaryBrand : 'transparent'}`, 
        borderRadius: theme.spacing.sm, 
        padding: theme.spacing.xs, 
        minHeight: '60px', 
        backgroundColor: isOver ? '#e0f2fe' : theme.colors.neutralBackground, 
        transition: 'background-color 0.2s ease, border-color 0.2s ease', 
        cursor: 'pointer' 
    };

    return (
        <div ref={setNodeRef} style={slotStyle} onClick={() => onSlotClick(date, mealType)}>
            <p style={{ ...theme.typography.caption, fontWeight: 'bold', color: theme.colors.textSecondary }}>{mealType}</p>
            {recipe && (
                <div style={{ position: 'relative', backgroundColor: theme.colors.secondaryBrand, color: theme.colors.neutralSurface, padding: theme.spacing.xs, borderRadius: theme.spacing.xs, marginTop: theme.spacing.xs }}>
                    <p style={{ ...theme.typography.caption, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '16px' }}>
                        {recipe.name || 'Recipe not found'}
                    </p>
                    <button onClick={handleRemove} style={{ position: 'absolute', top: '0', right: '4px', background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2em' }}>&times;</button>
                </div>
            )}
        </div>
    );
};

/**
 * Represents a single day in the meal plan calendar.
 * @param {object} props - Component props.
 * @param {Date} props.date - The date for this cell.
 * @param {Array} props.meals - The meals planned for this day.
 * @param {function} props.onSlotClick - Function to pass down to MealSlot.
 */
const DayCell = ({ date, meals, onSlotClick }) => {
    // Helper to find the recipe for a specific meal type on this day.
    const findRecipeForMeal = (mealType) => {
        const meal = meals.find(m => m.mealType.toLowerCase() === mealType.toLowerCase());
        return meal ? meal.recipeId : null;
    };

    const cellStyle = { border: `1px solid #e0e0e0`, borderRadius: theme.spacing.sm, padding: theme.spacing.sm, display: 'flex', flexDirection: 'column', gap: theme.spacing.sm };
    const dateNumberStyle = { ...theme.typography.body, fontWeight: '600', textAlign: 'center' };

    return (
        <div style={cellStyle}>
            <p style={dateNumberStyle}>{date.getDate()}</p>
            <MealSlot date={date} mealType="Breakfast" recipe={findRecipeForMeal('Breakfast')} onSlotClick={onSlotClick} />
            <MealSlot date={date} mealType="Lunch" recipe={findRecipeForMeal('Lunch')} onSlotClick={onSlotClick} />
            <MealSlot date={date} mealType="Dinner" recipe={findRecipeForMeal('Dinner')} onSlotClick={onSlotClick} />
        </div>
    );
};

/**
 * The main component for the weekly meal plan calendar view.
 * @param {object} props - Component props.
 * @param {function} props.onSlotClick - Function to handle clicks on meal slots.
 */
const MealPlanCalendar = ({ onSlotClick }) => {
  const { state, actions } = useContext(MealContext);
  const { mealPlan, mealPlanLoading } = state;
  const { fetchMealPlan } = actions;
  const [weekDates] = useState(getWeekDates());

  // Fetch the meal plan when the component mounts.
  useEffect(() => { if (!mealPlan) { fetchMealPlan(); } }, [mealPlan, fetchMealPlan]);

  if (mealPlanLoading) { return <div className="text-center p-4">Loading meal plan...</div>; }

  const headerCellStyle = { ...theme.typography.body, fontWeight: 'bold', textAlign: 'center', paddingBottom: theme.spacing.md };

  return (
    <Card>
      <h2 style={{ ...theme.typography.h3, marginBottom: theme.spacing.lg }}>This Week's Plan</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: theme.spacing.md }}>
        {/* Render the day headers (Sun, Mon, etc.) */}
        {weekDates.map(date => <div key={date.toISOString()} style={headerCellStyle}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>)}
        
        {/* Render the day cells for the week */}
        {weekDates.map(date => {
          // The meal plan from the backend is a map where keys are 'YYYY-MM-DD' strings.
          const dateKey = date.toISOString().split('T')[0];
          const mealsForDay = mealPlan?.plan?.[dateKey] || [];
          return <DayCell key={dateKey} date={date} meals={mealsForDay} onSlotClick={onSlotClick} />;
        })}
      </div>
    </Card>
  );
};

export default MealPlanCalendar;