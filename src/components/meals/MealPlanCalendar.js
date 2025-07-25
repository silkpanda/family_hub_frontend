import React, { useContext, useEffect, useState } from 'react';
import { MealContext } from '../../context/MealContext';
import { useDroppable } from '@dnd-kit/core';

// Helper function to get the dates for the current week (Sun-Sat)
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

// --- DayCell Component ---
// This new component represents a single day in the calendar and acts as a drop zone.
const DayCell = ({ date, meals }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: date.toISOString(), // A unique ID for this droppable area
        data: {
            date: date,
            isDayCell: true, // Custom data to identify this as a valid drop target
        },
    });

    const style = {
        backgroundColor: isOver ? '#e0f2fe' : undefined, // Highlight when dragging over
        border: isOver ? '2px dashed #0284c7' : '1px solid #e5e7eb',
    };

    return (
        <div ref={setNodeRef} style={style} className="rounded-lg p-2 min-h-[150px] bg-gray-50 transition-colors">
            <p className="font-semibold text-sm text-center">{date.getDate()}</p>
            <div className="mt-1 space-y-1">
                {meals.map((meal, index) => (
                    <div key={index} className="bg-blue-100 text-blue-800 text-xs rounded px-2 py-1 relative group">
                        <p className="font-semibold">{meal.mealType}</p>
                        <p className="truncate">{meal.recipeId?.name || 'Recipe not found'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


const MealPlanCalendar = () => {
  const { mealPlan, fetchMealPlan } = useContext(MealContext);
  const [weekDates] = useState(getWeekDates());

  useEffect(() => {
    if (!mealPlan) {
      fetchMealPlan();
    }
  }, [mealPlan, fetchMealPlan]);

  if (!mealPlan) {
    return <div className="text-center p-4">Loading meal plan...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">This Week's Plan</h2>
      <div className="grid grid-cols-7 gap-2">
        {/* Render headers */}
        {weekDates.map(date => (
          <div key={date.toISOString()} className="font-bold text-gray-700 text-center">
            {date.toLocaleDateString('en-US', { weekday: 'short' })}
          </div>
        ))}
        
        {/* Render day cells */}
        {weekDates.map(date => {
          const dateKey = date.toISOString().split('T')[0];
          const mealsForDay = mealPlan.plan[dateKey] || [];
          
          return (
            <DayCell key={dateKey} date={date} meals={mealsForDay} />
          );
        })}
      </div>
    </div>
  );
};

export default MealPlanCalendar;
