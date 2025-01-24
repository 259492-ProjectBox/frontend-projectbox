  "use client";

  import React, { useEffect, useState } from "react";
  import { Event } from "@/models/Event";
  import Spinner from "@/components/Spinner";
  import {
    createEvent,
    fetchEvents,
    updateEvent,
    deleteEvent,
  } from "@/utils/calendar/calendar";
  import EventTable from "@/components/EventTable";
  import Modal from "@/components/Modal";
  import EventForm from "@/components/EventForm";

  const ConfigCalendar = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [editEvent, setEditEvent] = useState<Event | null>(null);
    const [newEvent, setNewEvent] = useState<Partial<Event>>({
      title: "",
      description: "",
      start_date: "",
      end_date: "",
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
      const loadEvents = async () => {
        setLoading(true);
        try {
          const events = await fetchEvents(4);
          setEvents(events);
        } catch (error) {
          console.error("Error fetching events:", error);
        } finally {
          setLoading(false);
        }
      };
      loadEvents();
    }, []);

    const handleEditEvent = (event: Event) => {
      setEditEvent({
        ...event,
        start_date: event.start_date,
        end_date: event.end_date,
      });
      console.log(errorMessage);
      setErrorMessage(null);
      setIsModalOpen(true);
    };

    const handleUpdateEvent = async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        if (editEvent) {
          const payload: Event = {
            ...editEvent,
            start_date: editEvent.start_date,
            end_date: editEvent.end_date,
            major_id: 4,
          };
          await updateEvent(editEvent.id, payload);
          const updatedEvents = events.map((event) =>
            event.id === editEvent.id ? payload : event
          );
          setEvents(updatedEvents);
          setIsModalOpen(false);
          setEditEvent(null);
        }
      } catch (error: unknown) {
        // Type guard: Check if error is an instance of Error
        if (error instanceof Error && 'response' in error) {
          setErrorMessage((error as any).response?.data?.error || "Failed to update event");
        } else {
          setErrorMessage("Failed to update event");
        }
        console.error("Error updating event:", error);
      } finally {
        setLoading(false);
      }
    };
    
    

    const handleDeleteEvent = async (id: number) => {
      setLoading(true);
      try {
        await deleteEvent(id);
        setEvents(events.filter((event) => event.id !== id));
      } catch (error) {
        console.error("Error deleting event:", error);
      } finally {
        setLoading(false);
      }
    };

    const handleAddEvent = async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        if (
          newEvent.title &&
          newEvent.description &&
          newEvent.start_date &&
          newEvent.end_date
        ) {
          const payload: Event = {
            id: 0,
            title: newEvent.title,
            description: newEvent.description,
            start_date: newEvent.start_date,
            end_date: newEvent.end_date,
            major_id: 4,
          };
          const createdEvent = await createEvent(payload);
          setEvents((prev) => [...prev, createdEvent]);
          setIsAddModalOpen(false);
          setNewEvent({
            title: "",
            description: "",
            start_date: "",
            end_date: "",
          });
        }
      } catch (error: unknown) {
        // Type guard: Check if error is an instance of Error
        if (error instanceof Error && 'response' in error) {
          setErrorMessage((error as any).response?.data?.error || "Failed to create event");
        } else {
          setErrorMessage("Failed to create event");
        }
        console.error("Error adding event:", error);
      } finally {
        setLoading(false);
      }
    };
    
    
    

    if (loading) return <Spinner />;

    return (
      <div className="min-h-screen p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-700">Configure Calendar</h1>
          <button
            className="focus:outline-none text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Event
          </button>
        </div>

        <EventTable
          events={events}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
        />

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <EventForm
            event={editEvent || {}}
            onChange={(field, value) =>
              setEditEvent({ ...editEvent!, [field]: value })
            }
            onSubmit={handleUpdateEvent}
            onClose={() => setIsModalOpen(false)}
          />
        </Modal>

        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
          <EventForm
            event={newEvent}
            onChange={(field, value) =>
              setNewEvent({ ...newEvent, [field]: value })
            }
            onSubmit={handleAddEvent}
            onClose={() => setIsAddModalOpen(false)}
          />
        </Modal>
      </div>
    );
  };

  export default ConfigCalendar;
