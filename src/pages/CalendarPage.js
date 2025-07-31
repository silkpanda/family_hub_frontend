// ===================================================================================
// File: /frontend/src/pages/CalendarPage.js
// Purpose: The main UI for the Calendar feature.
//
// --- DEBUGGING UPDATE (Step 10 - Enhanced Logging) ---
// The pure CSS approach is not working. We need to gather more data to understand
// why. This update adds targeted logging to inspect the element during the drag.
//
// 1.  ADDED `handleEventDragStart`: A new handler function has been added to
//     capture the state at the exact moment a drag operation begins.
//
// 2.  ADDED DIAGNOSTIC LOGS: Inside the new handler, we are logging:
//     - `dragStartInfo.el`: The actual DOM element being dragged. This is the
//       most important piece of data.
//     - `dragStartInfo.el.className`: The string of CSS classes on that element,
//       which will confirm if our CSS selector is correct.
//
// 3.  APPLIED `eventDragStart` PROP: The `<FullCalendar>` component now uses the
//     `eventDragStart={handleEventDragStart}` prop to activate our new logger.
// ===================================================================================
import React, { useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useCalendar } from '../context/CalendarContext.js';
import EventModal from '../components/calendar/EventModal';
import { theme } from '../theme/theme';

const CalendarPage = () => {
  const { state, actions } = useCalendar();
  const { events, loading } = state;
  const { updateEvent } = actions;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDateInfo, setSelectedDateInfo] = useState(null);

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
    setSelectedEvent(null); 
    setSelectedDateInfo(selectInfo);
    setIsModalOpen(true);
  };
  
  const handleEventClick = (clickInfo) => {
    setSelectedDateInfo(null);
    setSelectedEvent(clickInfo.event.extendedProps);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedDateInfo(null);
  };

  const createUpdatePayload = (event) => {
    if (!event.start || !event.end) {
      return null;
    }
    const assignedToIds = event.extendedProps.assignedTo
      ? event.extendedProps.assignedTo.map(member => member._id || member.userId._id || member)
      : [];
    
    return {
      title: event.extendedProps.title,
      description: event.extendedProps.description,
      isAllDay: event.extendedProps.isAllDay,
      startTime: event.start.toISOString(),
      endTime: event.end.toISOString(),
      assignedTo: assignedToIds,
    };
  };

  const handleEventDrop = (dropInfo) => {
    const { event } = dropInfo;
    console.log('[DEBUG] Event Dropped:', event);
    const updatedEventData = createUpdatePayload(event);
    if (updatedEventData && updateEvent) {
      updateEvent(event.id, updatedEventData);
    } else {
      dropInfo.revert();
    }
  };
  
  const handleEventResize = (resizeInfo) => {
    const { event } = resizeInfo;
    console.log('[DEBUG] Event Resized:', event);
    const updatedEventData = createUpdatePayload(event);
    if (updatedEventData && updateEvent) {
      updateEvent(event.id, updatedEventData);
    } else {
      resizeInfo.revert();
    }
  };

  // --- NEW DIAGNOSTIC HANDLER ---
  const handleEventDragStart = (dragStartInfo) => {
    console.log("==============================================");
    console.log("[DEBUG] Event Drag Started");
    console.log("[DEBUG] The actual HTML element being dragged:", dragStartInfo.el);
    console.log("[DEBUG] Class names on the element:", `'${dragStartInfo.el.className}'`);
    console.log("==============================================");
  };

  if (loading) { return <div>Loading Calendar...</div>; }

  return (
    <div style={{ fontFamily: theme.typography.fontFamily, color: theme.colors.textPrimary }}>
      <style>{`
        .fc-daygrid-event.fc-event-dragging {
          max-width: calc(100% / 7 - 10px) !important;
          overflow: hidden !important;
        }
      `}</style>

      <h1 style={{ ...theme.typography.h1, marginBottom: theme.spacing.lg }}>Calendar</h1>
      <div className="calendar-container" style={{ backgroundColor: theme.colors.neutralSurface, padding: theme.spacing.md, borderRadius: theme.borderRadius.medium }}>
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
            eventResizableFromStart={true}
            eventResize={handleEventResize}
            // --- NEW PROP FOR LOGGING ---
            eventDragStart={handleEventDragStart}
            height="auto"
          />
      </div>
      {isModalOpen && (<EventModal event={selectedEvent} dateInfo={selectedDateInfo} onClose={closeModal} />)}
    </div>
  );
};

export default CalendarPage;
