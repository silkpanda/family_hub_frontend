// --- File: /frontend/src/components/meals/MealPlanCalendar.js ---
// Renders the weekly calendar view for the meal planner, with droppable meal slots.

import React, { useState } from 'react';
import { useMeals } from '../../context/MealContext';
import { useDroppable } from '@dnd-kit/core';
import { theme } from '../../theme/theme';
import Card from '../shared/Card';

const getWeekDates = () => {
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  return dates;
};

// MealSlot: A droppable area for a specific meal on a specific day.
const MealSlot = ({ date, mealType, recipe, onSlotClick }) => {
    const { actions } = useMeals();
    const { removeRecipeFromPlan } = actions;
    const { isOver, setNodeRef } = useDroppable({ id: `${date.toISOString()}-${mealType}`, data: { date, mealType, isMealSlot: true } });
    
    const handleRemove = (e) => { 
        e.stopPropagation(); 
        if (window.confirm(`Are you sure you want to remove ${recipe.name} from the plan?`)) { 
            if(removeRecipeFromPlan) removeRecipeFromPlan({ recipeId: recipe._id, date, mealType }); 
        } 
    };
    
    const slotStyle = { border: `2px dashed ${isOver ? theme.colors.primaryBrand : 'transparent'}`, borderRadius: theme.spacing.sm, padding: theme.spacing.xs, minHeight: '60px', backgroundColor: isOver ? '#e0f2fe' : theme.colors.neutralBackground, transition: 'background-color 0.2s ease, border-color 0.2s ease', cursor: 'pointer' };
    
    return (
        <div ref={setNodeRef} style={slotStyle} onClick={() => onSlotClick(date, mealType)}>
            <p style={{ ...theme.typography.caption, fontWeight: 'bold', color: theme.colors.textSecondary }}>{mealType}</p>
            {recipe && (<div style={{ position: 'relative', backgroundColor: theme.colors.secondaryBrand, color: theme.colors.neutralSurface, padding: theme.spacing.xs, borderRadius: theme.spacing.xs, marginTop: theme.spacing.xs }}><p style={{ ...theme.typography.caption, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '16px' }}>{recipe.name || 'Recipe not found'}</p><button onClick={handleRemove} style={{ position: 'absolute', top: '0', right: '4px', background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2em' }}>&times;</button></div>)}
        </div>
    );
};

// DayCell: Renders all the meal slots for a single day.
const DayCell = ({ date, meals, onSlotClick }) => {
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

const MealPlanCalendar = ({ onSlotClick }) => {
  const { state } = useMeals();
  const { mealPlan, mealPlanLoading } = state;
  const [weekDates] = useState(getWeekDates());

  if (mealPlanLoading) { return <div className="text-center p-4">Loading meal plan...</div>; }
  
  const headerCellStyle = { ...theme.typography.body, fontWeight: 'bold', textAlign: 'center', paddingBottom: theme.spacing.md };

  return (
    <Card>
      <h2 style={{ ...theme.typography.h3, marginBottom: theme.spacing.lg }}>This Week's Plan</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: theme.spacing.md }}>
        {weekDates.map(date => <div key={date.toISOString()} style={headerCellStyle}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>)}
        {weekDates.map(date => {
          const dateKey = date.toISOString().split('T')[0];
          const mealsForDay = mealPlan?.plan?.[dateKey] || [];
          return <DayCell key={dateKey} date={date} meals={mealsForDay} onSlotClick={onSlotClick} />;
        })}
      </div>
    </Card>
  );
};
export default MealPlanCalendar;