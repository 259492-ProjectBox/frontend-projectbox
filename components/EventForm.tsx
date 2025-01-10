import React from "react";
import { Event } from "@/models/Event";

interface EventFormProps {
  event: Partial<Event>;
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

// Utility function to convert from YYYY-MM-DD to DD-MM-YYYY
const formatToDDMMYYYY = (date: string): string => {
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
};

// Utility function to convert from DD-MM-YYYY to YYYY-MM-DD
const formatToYYYYMMDD = (date: string): string => {
  const [day, month, year] = date.split("-");
  return `${year}-${month}-${day}`;
};

const EventForm: React.FC<EventFormProps> = ({
  event,
  onChange,
  onSubmit,
  onClose,
}) => {
  return (
    <>
      <label className="block mb-2 text-gray-600">Title</label>
      <input
        type="text"
        value={event.title || ""}
        onChange={(e) => onChange("title", e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      <label className="block mb-2 text-gray-600">Description</label>
      <textarea
        value={event.description || ""}
        onChange={(e) => onChange("description", e.target.value)}
        rows={3}
        className="w-full p-2 mb-4 border rounded"
      />

      <label className="block mb-2 text-gray-600">Start Date</label>
      <div className="relative mb-4">
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={event.start_date ? formatToYYYYMMDD(event.start_date) : ""}
          onChange={(e) =>
            onChange("start_date", formatToDDMMYYYY(e.target.value))
          }
        />
      </div>

      <label className="block mb-2 text-gray-600">End Date</label>
      <div className="relative mb-4">
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={event.end_date ? formatToYYYYMMDD(event.end_date) : ""}
          onChange={(e) =>
            onChange("end_date", formatToDDMMYYYY(e.target.value))
          }
        />
      </div>

      <div className="flex justify-between">
        <button
          className="text-gray-900 bg-white border border-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
          onClick={onClose}
        >
          Close
        </button>
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
          onClick={onSubmit}
        >
          Save
        </button>
      </div>
    </>
  );
};

export default EventForm;
