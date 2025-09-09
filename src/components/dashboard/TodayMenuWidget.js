import React from 'react';

/**
 * A widget to display the planned meals for the current day.
 * It shows placeholders for Breakfast, Lunch, and Dinner.
 */
const TodayMenuWidget = () => {
    // Placeholder data - in the future, this would come from a MealPlannerContext
    const menu = {
        breakfast: 'Pancakes & Berries',
        lunch: 'Turkey Sandwiches',
        dinner: 'Spaghetti Bolognese',
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Menu</h3>
            <div className="space-y-3">
                <div className="flex items-center">
                    <span className="font-semibold text-gray-600 w-24">Breakfast:</span>
                    <span className="text-gray-800">{menu.breakfast || 'Not planned'}</span>
                </div>
                <div className="flex items-center">
                    <span className="font-semibold text-gray-600 w-24">Lunch:</span>
                    <span className="text-gray-800">{menu.lunch || 'Not planned'}</span>
                </div>
                <div className="flex items-center">
                    <span className="font-semibold text-gray-600 w-24">Dinner:</span>
                    <span className="text-gray-800">{menu.dinner || 'Not planned'}</span>
                </div>
            </div>
        </div>
    );
};

export default TodayMenuWidget;
