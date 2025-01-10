import React from "react";
import { Event } from "@/models/Event";

interface EventTableProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: number) => void;
}

const EventTable: React.FC<EventTableProps> = ({ events, onEdit, onDelete }) => {
  return (
    <div className="relative overflow-x-auto shadow-md rounded-lg">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            {/* <th className="px-6 py-3">ID</th> */}
            <th className="px-6 py-3">Title</th>
            <th className="px-6 py-3">Description</th>
            <th className="px-6 py-3">Start Date</th>
            <th className="px-6 py-3">End Date</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="bg-white border-b hover:bg-gray-100">
              {/* <td className="px-6 py-4">{event.id}</td> */}
              <td className="px-6 py-4">{event.title}</td>
              <td className="px-6 py-4">{event.description}</td>
              <td className="px-6 py-4">{event.start_date}</td>
              <td className="px-6 py-4">{event.end_date}</td>
              <td className="px-6 py-4 text-right">
                <button
                  className="text-blue-500 hover:underline mr-2"
                  onClick={() => onEdit(event)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => onDelete(event.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;
