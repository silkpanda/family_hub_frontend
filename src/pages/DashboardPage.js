// --- File: /frontend/src/pages/DashboardPage.js ---
// The main dashboard, showing today's meals and events. Serves as the "Kiosk" view.

import React, { useState, useContext } from 'react';
import { useMeals } from '../context/MealContext';
import { useCalendar } from '../context/CalendarContext';
import { useFamily } from '../context/FamilyContext';
import { AuthContext } from '../context/AuthContext';
import DailyMealPlan from '../components/dashboard/DailyMealPlan';
import FamilyCalendarView from '../components/dashboard/FamilyCalendarView';
import PinLoginModal from '../components/auth/PinLoginModal';
import Button from '../components/shared/Button';
import { theme } from '../theme/theme';

const DashboardPage = () => {
    const { state: mealState } = useMeals();
    const { state: calendarState } = useCalendar();
    const { state: familyState } = useFamily();
    const { isAuthenticated } = useContext(AuthContext);
    const [isPinModalOpen, setIsPinModalOpen] = useState(false);

    const { mealPlan, recipes, recipesLoading, mealPlanLoading } = mealState;
    const { events } = calendarState;
    const { family } = familyState;

    const today = new Date();
    const todayKey = today.toISOString().split('T')[0];
    const mealsForToday = mealPlan?.plan?.[todayKey] || [];
    const eventsForToday = (events || []).filter(event => {
        const eventStart = new Date(event.startTime);
        return today.toDateString() === eventStart.toDateString();
    });

    if (calendarState.loading || mealPlanLoading || recipesLoading || familyState.loading) {
        return <div style={{padding: theme.spacing.lg}}>Loading dashboard...</div>;
    }

    return (
        <div style={{ fontFamily: theme.typography.fontFamily, color: theme.colors.textPrimary, padding: theme.spacing.lg }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg }}>
                <h1 style={theme.typography.h1}>Dashboard</h1>
                {!isAuthenticated && (
                    <Button variant="primary" onClick={() => setIsPinModalOpen(true)}>Parent Login</Button>
                )}
            </div>

            <div style={{ marginBottom: theme.spacing.xl }}>
                <h2 style={{ ...theme.typography.h3, marginBottom: theme.spacing.md }}>Today's Meals</h2>
                <DailyMealPlan meals={mealsForToday} allRecipes={recipes} />
            </div>

            <div>
                 <h2 style={{ ...theme.typography.h3, marginBottom: theme.spacing.md }}>Who's Doing What Today</h2>
                <FamilyCalendarView events={eventsForToday} members={family?.members || []} />
            </div>

            {isPinModalOpen && <PinLoginModal onClose={() => setIsPinModalOpen(false)} />}
        </div>
    );
};

export default DashboardPage;