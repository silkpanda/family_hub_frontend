// FullCalendar component and handles user interactions like clicking on dates or events.
// ===================================================================================
import React, { useContext, useEffect, useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarContext } from '../context/CalendarContext';
import EventModal from '../components/calendar/EventModal';
import { theme } from '../theme/theme';

const CalendarPage = () => {
  // --- State Management ---
  // Access the calendar's state (events, loading status) and action functions from the context.
  const { events, loading, fetchEvents, updateEvent } = useContext(CalendarContext);
  
  // Local state to manage the visibility and content of the event creation/editing modal.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); // Holds the event data when editing.
  const [selectedDateInfo, setSelectedDateInfo] = useState(null); // Holds date info when creating a new event.

  // --- Data Fetching ---
  // When the component first mounts, call the `fetchEvents` action from the context
  // to load all event data from the backend.
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]); // Dependency array ensures this runs only when `fetchEvents` function changes.

  // --- Data Transformation ---
  // `useMemo` is a performance optimization. It transforms the raw event data from our database
  // into the format that the FullCalendar library expects. This transformation only re-runs
  // when the `events` array from the context actually changes.
  const calendarEvents = useMemo(() => {
    return events.map(event => ({
      id: event._id,
      title: event.title,
      start: event.startTime,
      end: event.endTime,
      allDay: event.isAllDay,
      backgroundColor: event.color,
      borderColor: event.color,
      extendedProps: event, // Store the original event object for easy access later.
    }));
  }, [events]);

  // --- Event Handlers ---
  // Triggered when a user clicks and drags on a date or time slot in the calendar.
  const handleDateSelect = (selectInfo) => {
    setSelectedDateInfo(selectInfo);
    setSelectedEvent(null); // Ensure we are in "create" mode.
    setIsModalOpen(true);
  };

  // Triggered when a user clicks on an existing event.
  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event.extendedProps); // Pass the full original event data to the modal.
    setSelectedDateInfo(null); // Ensure we are in "edit" mode.
    setIsModalOpen(true);
  };

  // Closes the modal and resets its state.
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedDateInfo(null);
  };

  // Triggered when an event is dragged and dropped to a new date/time.
  const handleEventDrop = (dropInfo) => {
    const { event } = dropInfo;
    // Guard clause to prevent crashes if the drop results in an invalid date.
    if (!event.start || !event.end) {
      dropInfo.revert(); // Safely cancels the drop.
      return;
    }
    const updatedEventData = {
      ...event.extendedProps,
      startTime: event.start.toISOString(),
      endTime: event.end.toISOString(),
    };
    updateEvent(event.id, updatedEventData);
  };

  // Triggered when an event is resized.
  const handleEventResize = (resizeInfo) => {
    // Similar logic to handleEventDrop.
    const { event } = resizeInfo;
    if (!event.start || !event.end) {
      resizeInfo.revert();
      return;
    }
    const updatedEventData = {
      ...event.extendedProps,
      startTime: event.start.toISOString(),
      endTime: event.end.toISOString(),
    };
    updateEvent(event.id, updatedEventData);
  };

  if (loading) {
    return <div>Loading Calendar...</div>;
  }

  return (
    <div style={{ fontFamily: theme.typography.fontFamily, color: theme.colors.textPrimary }}>
      <h1 style={{ ...theme.typography.h1, marginBottom: theme.spacing.lg }}>Calendar</h1>
      <div className="calendar-container" style={{ backgroundColor: theme.colors.neutralSurface, padding: theme.spacing.md, borderRadius: theme.borderRadius.medium }}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView="dayGridMonth"
            events={calendarEvents}
            selectable={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            editable={true} // Enables dragging and resizing
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            height="auto"
          />
      </div>
      {/* The modal is only rendered when `isModalOpen` is true. */}
      {isModalOpen && (
        <EventModal
          event={selectedEvent}
          dateInfo={selectedDateInfo}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default CalendarPage;