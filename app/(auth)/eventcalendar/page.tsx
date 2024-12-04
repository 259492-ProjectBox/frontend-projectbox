"use client"
import React, { useEffect, useState } from "react";
import { fetchRecords } from "@/utils/airtable";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB"); // Format: dd/mm/yyyy
};

const EventCalendarPage = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const records = await fetchRecords("ConfigCalendar");
      setEvents(records);
    };
    fetchEvents();
  }, []);

  const groupedEvents = events.reduce((acc: any, event: any) => {
    const month = new Date(event.fields["Start Date"]).toLocaleString("default", { month: "long" });
    acc[month] = acc[month] || [];
    acc[month].push(event.fields);
    return acc;
  }, {});

  return (
    <div className="min-h-screen p-4 bg-stone-100">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Event Calendar</h1>
        {Object.entries(groupedEvents).map(([month, events]: any) => (
          <div key={month} className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">{month}</h2>
            {events.map((event: any, index: number) => (
              <div key={index} className="flex items-center mb-3">
                <div className="bg-red-300 text-red-800 px-3 py-1 rounded-lg text-sm font-semibold mr-4">
                  {formatDate(event["Start Date"])} - {formatDate(event["End Date"])}
                </div>
                <p className="text-gray-700">{event.Description}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCalendarPage;
