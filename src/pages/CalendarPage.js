import React, { useContext, useMemo } from 'react';
import { CalendarContext } from '../context/CalendarContext';
import { ModalContext } from '../context/ModalContext';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";

const CalendarPage = () => {
    const { events, loading, addEvent, updateEvent, deleteEvent } = useContext(CalendarContext);
    const { showModal } = useContext(ModalContext);

    const calendarEvents = useMemo(() => events.map(event => ({
        id: event._id, // FullCalendar needs a unique ID for event manipulation
        title: event.title,
        start: event.start,
        end: event.end,
        allDay: event.allDay,
        extendedProps: { ...event }
    })), [events]);

    const handleSaveEvent = async (eventData, eventId) => {
        if (eventId) {
            await updateEvent(eventId, eventData);
        } else {
            await addEvent(eventData);
        }
    };

    const handleDeleteEvent = (eventId) => {
        // --- Detailed Logging ---
        console.log(`[CalendarPage.js] - handleDeleteEvent function called for eventId: ${eventId}`);
        if (deleteEvent) {
            deleteEvent(eventId);
        }
    };

    const handleDateSelect = (selectInfo) => {
        showModal('addEditEvent', {
            selectedDate: selectInfo.startStr,
            onSave: handleSaveEvent,
        });
    };

    const handleEventClick = (clickInfo) => {
        showModal('addEditEvent', {
            eventToEdit: clickInfo.event.extendedProps,
            onSave: handleSaveEvent,
            onDelete: handleDeleteEvent,
        });
    };

    if (loading) {
        return <div className="text-center p-8">Loading calendar events...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Shared Calendar</h2>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,dayGridWeek,dayGridDay' }}
                events={calendarEvents}
                selectable={true}
                select={handleDateSelect}
                eventClick={handleEventClick}
                height="auto"
            />
        </div>
    );
};

export default CalendarPage;

