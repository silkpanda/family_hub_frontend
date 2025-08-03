// ===================================================================================
// File: /frontend/src/pages/CalendarPage.js
// Purpose: The main UI for the Calendar feature.
//
// --- Dev Notes (UI Refinement) ---
// - REFINEMENT: The event modal is now a moveable pop-out.
// - Added `modalPosition` state to track the coordinates of a user's click.
// - The `handleDateSelect` and `handleEventClick` handlers now capture the
//   bounding rectangle of the clicked element (`day cell` or `event`).
// - This position data is passed as a prop to the `EventModal` to allow it to
//   position itself intelligently on the screen.
// ===================================================================================
import React, { useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useCalendar } from '../context/CalendarContext';
import EventModal from '../components/calendar/EventModal';
import { theme } from '../theme/theme';

const CalendarPage = () => {
  const { state, actions } = useCalendar();
  const { events, loading } = state;
  const { updateEvent } = actions;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDateInfo, setSelectedDateInfo] = useState(null);
  const [modalPosition, setModalPosition] = useState(null); // --- NEW ---

  const calendarEvents = useMemo(() => {
    if (!events) return [];
    return events.map(event => ({
      id: event._id,
      title: event.title,
      start: event.startTime,
      end: event.endTime,
      allDay: event.isAllDay,
      backgroundColor: event.color,
      borderColor: event.color,
      extendedProps: event
    }));
  }, [events]);

  const handleDateSelect = (selectInfo) => {
    const rect = selectInfo.jsEvent.target.getBoundingClientRect();
    setModalPosition({ top: rect.top, left: rect.left, right: rect.right }); // --- NEW ---
    setSelectedEvent(null); 
    setSelectedDateInfo(selectInfo);
    setIsModalOpen(true);
  };
  
  const handleEventClick = (clickInfo) => {
    const rect = clickInfo.el.getBoundingClientRect();
    setModalPosition({ top: rect.top, left: rect.left, right: rect.right }); // --- NEW ---
    setSelectedDateInfo(null);
    setSelectedEvent(clickInfo.event.extendedProps);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedDateInfo(null);
    setModalPosition(null); // --- NEW ---
  };

  const handleEventDrop = (dropInfo) => {
    const { event } = dropInfo;
    if (!event.start || !event.end) {
      dropInfo.revert();
      return;
    }
    const assignedToIds = event.extendedProps.assignedTo
      ? event.extendedProps.assignedTo.map(member => member._id || member.userId._id || member)
      : [];
    const updatedEventData = {
      title: event.extendedProps.title,
      description: event.extendedProps.description,
      isAllDay: event.extendedProps.isAllDay,
      startTime: event.start.toISOString(),
      endTime: event.end.toISOString(),
      assignedTo: assignedToIds,
    };
    if(updateEvent) updateEvent(event.id, updatedEventData);
  };

  if (loading) { return <div>Loading Calendar...</div>; }

  return (
    <div style={{ fontFamily: theme.typography.fontFamily, color: theme.colors.textPrimary }}>
      <h1 style={{ ...theme.typography.h1, marginBottom: theme.spacing.lg }}>Calendar</h1>
      <div className="calendar-container" style={{ backgroundColor: theme.colors.neutralSurface, padding: theme.spacing.md, borderRadius: theme.borderRadius.large }}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
            initialView="dayGridMonth"
            events={calendarEvents}
            selectable={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            editable={true}
            eventDrop={handleEventDrop}
            height="auto"
          />
      </div>
      {isModalOpen && (<EventModal event={selectedEvent} dateInfo={selectedDateInfo} onClose={closeModal} position={modalPosition} />)}
    </div>
  );
};

export default CalendarPage;
