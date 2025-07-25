import React, { useContext, useEffect, useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick and drag/resize

import { CalendarContext } from '../context/CalendarContext';
import EventModal from '../components/calendar/EventModal';

const CalendarPage = () => {
  const { events, loading, fetchEvents, updateEvent } = useContext(CalendarContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDateInfo, setSelectedDateInfo] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const calendarEvents = useMemo(() => {
    return events.map(event => ({
      id: event._id,
      title: event.title,
      start: event.startTime,
      end: event.endTime,
      allDay: event.isAllDay,
      backgroundColor: event.color,
      borderColor: event.color,
      extendedProps: event,
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

  // --- CORRECTED: Handler for when an event is dragged and dropped ---
  const handleEventDrop = (dropInfo) => {
    const { event } = dropInfo;

    // Guard Clause: Check for invalid dates after a drop.
    // This prevents a crash if event.end becomes null.
    if (!event.start || !event.end) {
      console.error("Event drop resulted in invalid dates. Reverting.");
      dropInfo.revert(); // Safely cancel the drop.
      return;
    }

    const updatedEventData = {
      ...event.extendedProps,
      startTime: event.start.toISOString(),
      endTime: event.end.toISOString(),
    };
    updateEvent(event.id, updatedEventData);
  };

  // --- CORRECTED: Handler for when an event is resized ---
  const handleEventResize = (resizeInfo) => {
    const { event } = resizeInfo;

    // Guard Clause: Also protect the resize handler.
    if (!event.start || !event.end) {
      console.error("Event resize resulted in invalid dates. Reverting.");
      resizeInfo.revert(); // Safely cancel the resize.
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
        editable={true}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
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
