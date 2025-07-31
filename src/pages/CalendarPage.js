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
  const { updateEvent } = actions; // We only need updateEvent for drag-and-drop

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

  // --- THIS IS THE CORRECTED FUNCTION ---
  const handleDateSelect = (selectInfo) => {
    // Clear any previously selected event
    setSelectedEvent(null); 
    // Store the date information for the new event
    setSelectedDateInfo(selectInfo);
    // Set the state to open the modal
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

  const handleEventDrop = (dropInfo) => {
    const { event } = dropInfo;
    if (!event.start || !event.end) {
      dropInfo.revert();
      return;
    }
    const updatedEventData = { ...event.extendedProps, startTime: event.start.toISOString(), endTime: event.end.toISOString() };
    updateEvent(event.id, updatedEventData);
};

  const handleEventResize = (resizeInfo) => { /* ... */ };

  if (loading) { return <div>Loading Calendar...</div>; }

  return (
    <div style={{ fontFamily: theme.typography.fontFamily, color: theme.colors.textPrimary }}>
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
            eventResize={handleEventResize}
            height="auto"
          />
      </div>
      {/* This line correctly renders the modal when isModalOpen is true */}
      {isModalOpen && (<EventModal event={selectedEvent} dateInfo={selectedDateInfo} onClose={closeModal} />)}
    </div>
  );
};

export default CalendarPage;