// ===================================================================================
// File: /frontend/src/pages/DashboardPage.js
// Purpose: The main container for the new Dashboard feature.
// ===================================================================================
import React, { useContext } from 'react';
import { useMeals } from '../context/MealContext';
import { useCalendar } from '../context/CalendarContext';
import { useFamily } from '../context/FamilyContext';
import DailyMealPlan from '../components/dashboard/DailyMealPlan';
import FamilyCalendarView from '../components/dashboard/FamilyCalendarView';
import { theme } from '../theme/theme';

const DashboardPage = () => {
    const { state: mealState } = useMeals();
    const { state: calendarState } = useCalendar();
    const { state: familyState } = useFamily();

    const { mealPlan, recipes } = mealState;
    const { events } = calendarState;
    const { family } = familyState;

    // --- Data Processing ---
    const today = new Date();
    const todayKey = today.toISOString().split('T')[0]; // Get 'YYYY-MM-DD' format

    // Get today's meals from the meal plan
    const mealsForToday = mealPlan?.plan?.[todayKey] || [];

    // Get today's events from the calendar events
    const eventsForToday = (events || []).filter(event => {
        const eventStart = new Date(event.startTime);
        const eventEnd = new Date(event.endTime);
        // Check if today is between the event's start and end date (inclusive)
        return today >= new Date(eventStart.setHours(0,0,0,0)) && today <= new Date(eventEnd.setHours(0,0,0,0));
    });

    if (calendarState.loading || mealState.mealPlanLoading || familyState.loading) {
        return <div>Loading dashboard...</div>;
    }

    return (
        <div style={{ fontFamily: theme.typography.fontFamily, color: theme.colors.textPrimary }}>
            <h1 style={{ ...theme.typography.h1, marginBottom: theme.spacing.lg }}>
                Dashboard
            </h1>

            {/* Section 1: Daily Meal Plan */}
            <div style={{ marginBottom: theme.spacing.xl }}>
                <h2 style={{ ...theme.typography.h3, marginBottom: theme.spacing.md }}>Today's Meals</h2>
                <DailyMealPlan meals={mealsForToday} allRecipes={recipes} />
            </div>

            {/* Section 2: Family Calendar View */}
            <div>
                 <h2 style={{ ...theme.typography.h3, marginBottom: theme.spacing.md }}>Who's Doing What Today</h2>
                <FamilyCalendarView events={eventsForToday} members={family?.members || []} />
            </div>
        </div>
    );
};

export default DashboardPage;
