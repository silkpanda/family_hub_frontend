import React, { useContext } from 'react';
import { HouseholdContext } from '../../context/HouseholdContext';

/**
 * A widget to display a consolidated schedule of today's events
 * for all members of the household.
 */
const ScheduleWidget = () => {
    const { householdData } = useContext(HouseholdContext);

    // Placeholder data - this would eventually be fetched from Google Calendar API
    const events = [
        { id: 1, member: 'Alice', time: '9:00 AM', title: 'School Drop-off' },
        { id: 2, member: 'Bob', time: '11:00 AM', title: 'Dentist Appointment' },
        { id: 3, member: 'Charlie', time: '4:00 PM', title: 'Soccer Practice' },
        { id: 4, member: 'Alice', time: '6:30 PM', title: 'Piano Lessons' },
    ];

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Schedule</h3>
            <div className="space-y-4">
                {events.length > 0 ? (
                    events.map(event => (
                        <div key={event.id} className="flex items-center space-x-4">
                            <div className="w-24 text-right">
                                <span className="font-semibold text-indigo-600">{event.time}</span>
                            </div>
                            <div className="flex-1 border-l-4 border-indigo-200 pl-4">
                                <p className="font-semibold text-gray-800">{event.title}</p>
                                <p className="text-sm text-gray-500">{event.member}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No events scheduled for today.</p>
                )}
            </div>
        </div>
    );
};

export default ScheduleWidget;
