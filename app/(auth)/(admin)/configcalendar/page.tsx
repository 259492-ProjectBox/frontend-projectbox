"use client";
import React, { useEffect, useState } from "react";
import {
  fetchRecords,
  updateRecords,
  deleteRecords,
  createRecords,
} from "@/utils/airtable";
import Spinner from "@/components/Spinner";

const ConfigCalendar = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [editEvent, setEditEvent] = useState<any>(null);
  const [newEvent, setNewEvent] = useState<any>({
    fields: { Description: "", "Start Date": "", "End Date": "" },
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true); // Start loading
      try {
        const records = await fetchRecords("ConfigCalendar");
        setEvents(records);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false); // End loading
      }
    };
    fetchEvents();
  }, []);

  const handleEditEvent = (event: any) => {
    setEditEvent(event);
    setIsModalOpen(true);
  };

  const handleUpdateEvent = async () => {
    setLoading(true); // Start loading
    try {
      const updatedRecords = await updateRecords("ConfigCalendar", [
        { id: editEvent.id, fields: editEvent.fields },
      ]);
      setEvents((prev) =>
        prev.map((event) =>
          event.id === updatedRecords[0].id ? updatedRecords[0] : event
        )
      );
    } catch (error) {
      console.error("Error updating event:", error);
    } finally {
      setLoading(false); // End loading
      setIsModalOpen(false);
      setEditEvent(null);
    }
  };

  const handleDeleteEvent = async () => {
    setLoading(true); // Start loading
    try {
      await deleteRecords("ConfigCalendar", [editEvent.id]);
      setEvents((prev) => prev.filter((event) => event.id !== editEvent.id));
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setLoading(false); // End loading
      setIsModalOpen(false);
      setEditEvent(null);
    }
  };

  const handleAddEvent = async () => {
    setLoading(true); // Start loading
    try {
      const createdRecords = await createRecords("ConfigCalendar", [newEvent]);
      setEvents((prev) => [...prev, ...createdRecords]);
    } catch (error) {
      console.error("Error adding event:", error);
    } finally {
      setLoading(false); // End loading
      setIsAddModalOpen(false);
      setNewEvent({
        fields: { Description: "", "Start Date": "", "End Date": "" },
      });
    }
  };

  if (loading) return <Spinner />; // Show spinner during loading

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">
          Configure Calendar
        </h1>
        <button
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-4 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Calendar Event
        </button>

        {/* Light Themed Table */}
        <div className="relative overflow-x-auto shadow-md rounded-lg">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3">
                  ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Description
                </th>
                <th scope="col" className="px-6 py-3">
                  Start Date
                </th>
                <th scope="col" className="px-6 py-3">
                  End Date
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr
                  key={event.id}
                  className="bg-white border-b hover:bg-gray-100 transition-all duration-200"
                >
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {event.fields.ID || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {event.fields.Description || "No Description"}
                  </td>
                  <td className="px-6 py-4">
                    {event.fields["Start Date"]
                      ? new Date(event.fields["Start Date"]).toLocaleDateString(
                          "en-GB"
                        )
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {event.fields["End Date"]
                      ? new Date(event.fields["End Date"]).toLocaleDateString(
                          "en-GB"
                        )
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className="text-blue-500 hover:underline mr-2"
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
      </div>

      {/* Edit Modal */}
      {isModalOpen && editEvent && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-bold mb-4 text-gray-700">Edit Event</h2>
            <label className="block mb-2 text-gray-600">Description</label>
            <textarea
              value={editEvent.fields.Description}
              onChange={(e) =>
                setEditEvent({
                  ...editEvent,
                  fields: { ...editEvent.fields, Description: e.target.value },
                })
              }
              rows={3}
              className="w-full p-2 mb-4 border rounded h-24 resize-y"
              placeholder="Enter a description..."
            />
            <label className="block mb-2 text-gray-600">Start Date</label>
            <input
              type="date"
              value={editEvent.fields["Start Date"]}
              onChange={(e) =>
                setEditEvent({
                  ...editEvent,
                  fields: { ...editEvent.fields, "Start Date": e.target.value },
                })
              }
              className="w-full p-2 mb-4 border rounded"
            />
            <label className="block mb-2 text-gray-600">End Date</label>
            <input
              type="date"
              value={editEvent.fields["End Date"]}
              onChange={(e) =>
                setEditEvent({
                  ...editEvent,
                  fields: { ...editEvent.fields, "End Date": e.target.value },
                })
              }
              className="w-full p-2 mb-4 border rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={handleUpdateEvent}
              >
                Save
              </button>
              <button
                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                onClick={handleDeleteEvent}
              >
                Delete
              </button>
              <button
                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                onClick={() => setIsModalOpen(false)}
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
