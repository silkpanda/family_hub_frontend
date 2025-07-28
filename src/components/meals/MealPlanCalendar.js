import React, { useContext, useEffect, useState } from 'react';
import { MealContext } from '../../context/MealContext';
import { useDroppable } from '@dnd-kit/core';
import { theme } from '../../theme/theme';
import Card from '../shared/Card';

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
const DayCell = ({ date, meals }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: date.toISOString(),
        data: {
            date: date,
            isDayCell: true,
        },
    });

    const cellStyle = {
        minHeight: '150px',
        backgroundColor: isOver ? '#e0f2fe' : theme.colors.neutralBackground,
        border: isOver ? `2px dashed ${theme.colors.primaryBrand}` : `1px solid #e0e0e0`,
        borderRadius: theme.spacing.sm,
        padding: theme.spacing.sm,
        transition: 'background-color 0.2s ease-in-out, border-color 0.2s ease-in-out',
    };

    const dateNumberStyle = {
        ...theme.typography.body,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: theme.spacing.sm,
    };

    return (
        <div ref={setNodeRef} style={cellStyle}>
            <p style={dateNumberStyle}>{date.getDate()}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
                {meals.map((meal, index) => (
                    <div key={index} style={{ backgroundColor: theme.colors.secondaryBrand, color: theme.colors.neutralSurface, padding: theme.spacing.xs, borderRadius: theme.spacing.xs }}>
                        <p style={{ ...theme.typography.caption, fontWeight: 'bold' }}>{meal.mealType}</p>
                        <p style={{ ...theme.typography.caption, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{meal.recipeId?.name || 'Recipe not found'}</p>
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

  const headerCellStyle = {
    ...theme.typography.body,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: theme.spacing.md,
  };

  return (
    <Card>
      <h2 style={{ ...theme.typography.h3, marginBottom: theme.spacing.lg }}>This Week's Plan</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: theme.spacing.md }}>
        {/* Render headers */}
        {weekDates.map(date => (
          <div key={date.toISOString()} style={headerCellStyle}>
            {date.toLocaleDateString('en-US', { weekday: 'short' })}
          </div>
        ))}
        
        {/* Render day cells */}
        {weekDates.map(date => {
          const dateKey = date.toISOString().split('T')[0];
          // Mongoose Map is converted to an object when using .lean()
          const mealsForDay = mealPlan.plan[dateKey] || [];
          
          return (
            <DayCell key={dateKey} date={date} meals={mealsForDay} />
          );
        })}
      </div>
    </Card>
  );
};

export default MealPlanCalendar;
