"use client";
import React, { useEffect, useState } from "react";
import { fetchRecords, updateRecords, deleteRecords, createRecords } from "@/utils/airtable";

const ConfigCalendar = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [editEvent, setEditEvent] = useState<any>(null);
  const [newEvent, setNewEvent] = useState<any>({ fields: { Description: "", "Start Date": "", "End Date": "" } });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      const records = await fetchRecords("ConfigCalendar");
      setEvents(records);
    };
    fetchEvents();
  }, []);

  const handleEditEvent = (event: any) => {
    setEditEvent(event);
    setIsModalOpen(true);
  };

  const handleUpdateEvent = async () => {
    const updatedRecords = await updateRecords("ConfigCalendar", [
      {
        id: editEvent.id,
        fields: editEvent.fields,
      },
    ]);
    setEvents(prev =>
      prev.map(event => (event.id === updatedRecords[0].id ? updatedRecords[0] : event))
    );
    setIsModalOpen(false);
    setEditEvent(null);
  };

  const handleDeleteEvent = async () => {
    await deleteRecords("ConfigCalendar", [editEvent.id]);
    setEvents(prev => prev.filter(event => event.id !== editEvent.id));
    setIsModalOpen(false);
    setEditEvent(null);
  };

  const handleAddEvent = async () => {
    const createdRecords = await createRecords("ConfigCalendar", [newEvent]);
    setEvents(prev => [...prev, ...createdRecords]);
    setIsAddModalOpen(false);
    setNewEvent({ fields: { Description: "", "Start Date": "", "End Date": "" } });
  };

  return (
    <div className="min-h-screen p-4 bg-stone-100">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Configure Calendar</h1>
        <button
          className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Calendar Event
        </button>
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-200 px-4 py-2">ID</th>
              <th className="border border-gray-200 px-4 py-2">Description</th>
              <th className="border border-gray-200 px-4 py-2">Start Date</th>
              <th className="border border-gray-200 px-4 py-2">End Date</th>
              <th className="border border-gray-200 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id}>
                <td className="border border-gray-200 px-4 py-2">{event.fields.ID}</td>
                <td className="border border-gray-200 px-4 py-2">{event.fields.Description}</td>
                <td className="border border-gray-200 px-4 py-2">
                  {new Date(event.fields["Start Date"]).toLocaleDateString("en-GB")}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {new Date(event.fields["End Date"]).toLocaleDateString("en-GB")}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => handleEditEvent(event)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && editEvent && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Edit Event</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description</label>
              <input
                type="text"
                value={editEvent.fields.Description}
                onChange={e =>
                  setEditEvent({
                    ...editEvent,
                    fields: { ...editEvent.fields, Description: e.target.value },
                  })
                }
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={editEvent.fields["Start Date"]}
                onChange={e =>
                  setEditEvent({
                    ...editEvent,
                    fields: { ...editEvent.fields, "Start Date": e.target.value },
                  })
                }
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={editEvent.fields["End Date"]}
                onChange={e =>
                  setEditEvent({
                    ...editEvent,
                    fields: { ...editEvent.fields, "End Date": e.target.value },
                  })
                }
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                onClick={handleUpdateEvent}
              >
                Save
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleDeleteEvent}
              >
                Delete
              </button>
              <button
                className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Add Event</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description</label>
              <input
                type="text"
                value={newEvent.fields.Description}
                onChange={e =>
                  setNewEvent({
                    ...newEvent,
                    fields: { ...newEvent.fields, Description: e.target.value },
                  })
                }
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={newEvent.fields["Start Date"]}
                onChange={e =>
                  setNewEvent({
                    ...newEvent,
                    fields: { ...newEvent.fields, "Start Date": e.target.value },
                  })
                }
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={newEvent.fields["End Date"]}
                onChange={e =>
                  setNewEvent({
                    ...newEvent,
                    fields: { ...newEvent.fields, "End Date": e.target.value },
                  })
                }
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                onClick={handleAddEvent}
              >
                Add
              </button>
              <button
                className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigCalendar;
