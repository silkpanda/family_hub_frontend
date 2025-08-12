// --- File: /frontend/src/pages/CalendarPage.js ---
// Renders the main calendar view using the FullCalendar library.

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
  const [modalPosition, setModalPosition] = useState(null);

  // Memoize the transformation of backend events into FullCalendar's event format.
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

  // handleDateSelect: Opens the modal to create a new event when a date is clicked.
  const handleDateSelect = (selectInfo) => {
    const rect = selectInfo.jsEvent.target.getBoundingClientRect();
    setModalPosition({ top: rect.top, left: rect.left, right: rect.right });
    setSelectedEvent(null); 
    setSelectedDateInfo(selectInfo);
    setIsModalOpen(true);
  };
  
  // handleEventClick: Opens the modal to edit an existing event when it's clicked.
  const handleEventClick = (clickInfo) => {
    const rect = clickInfo.el.getBoundingClientRect();
    setModalPosition({ top: rect.top, left: rect.left, right: rect.right });
    setSelectedDateInfo(null);
    setSelectedEvent(clickInfo.event.extendedProps);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedDateInfo(null);
    setModalPosition(null);
  };

  // handleEventDrop: Handles drag-and-drop functionality to update event times.
  const handleEventDrop = (dropInfo) => {
    const { event } = dropInfo;
    if (!event.start || !event.end) {
      dropInfo.revert(); // Revert the drop if times are invalid.
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

  if (loading) { return <div style={{padding: theme.spacing.lg}}>Loading Calendar...</div>; }

  return (
    <div style={{ fontFamily: theme.typography.fontFamily, color: theme.colors.textPrimary, padding: theme.spacing.lg }}>
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