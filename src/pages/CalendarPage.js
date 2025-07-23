import React, { useContext, useEffect, useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick

import { CalendarContext } from '../context/CalendarContext';
import EventModal from '../components/calendar/EventModal';

const CalendarPage = () => {
  const { events, loading, fetchEvents } = useContext(CalendarContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDateInfo, setSelectedDateInfo] = useState(null);

  useEffect(() => {
    fetchEvents();
    // The eslint-disable-next-line comment has been removed to fix the compilation error.
  }, []);

  // Memoize events to prevent re-rendering and format for FullCalendar
  const calendarEvents = useMemo(() => {
    return events.map(event => ({
      id: event._id,
      title: event.title,
      start: event.startTime,
      end: event.endTime,
      allDay: event.isAllDay,
      backgroundColor: event.color,
      borderColor: event.color,
      extendedProps: event, // Store original event object for use in modals
    }));
  }, [events]);

  const handleDateSelect = (selectInfo) => {
    setSelectedDateInfo(selectInfo);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event.extendedProps);
    setSelectedDateInfo(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedDateInfo(null);
  };

  if (loading) {
    return <div>Loading Calendar...</div>;
  }

  return (
    <div className="p-4 md:p-8">
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
        editable={true} // Allows dragging and resizing events
        // Note: To make drag-and-drop updates work, you would add eventDrop/eventResize handlers here
        // that call the `updateEvent` function from your context.
      />
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
