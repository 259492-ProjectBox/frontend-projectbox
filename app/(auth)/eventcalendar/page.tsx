"use client";

import React, { useEffect, useState } from "react";
import getEventsByMajorId from "@/utils/eventCalendar/getEventsByMajorId";
import { Event } from "@/models/Event";
import Spinner from "@/components/Spinner";

const monthColors: { [key: string]: { bg: string; text: string } } = {
  January: { bg: "bg-[#F4B2A3]", text: "text-[#7A3D2C]" },
  February: { bg: "bg-[#C49AC8]", text: "text-[#5F3A64]" },
  March: { bg: "bg-[#C6E6E4]", text: "text-[#3D6261]" },
  April: { bg: "bg-[#FF6B6B]", text: "text-[#8C2E2E]" },
  May: { bg: "bg-[#73B75B]", text: "text-[#2C4E1C]" },
  June: { bg: "bg-[#F7D455]", text: "text-[#8C6A11]" },
  July: { bg: "bg-[#F5C1CB]", text: "text-[#7A4C52]" },
  August: { bg: "bg-[#F68A4B]", text: "text-[#8C4A24]" },
  September: { bg: "bg-[#496FC2]", text: "text-[#1E3466]" },
  October: { bg: "bg-[#8BB7D8]", text: "text-[#3A5B77]" },
  November: { bg: "bg-[#F27891]", text: "text-[#7A2E3E]" },
  December: { bg: "bg-[#49C5D6]", text: "text-[#2A5E66]" },
};

const EventCalendarPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const records = await getEventsByMajorId(4); // Change `4` to the desired major ID
        setEvents(records || []); // Ensure that records is never null
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Utility to parse `DD-MM-YYYY` date strings into `Date` objects
  const parseDate = (dateString: string | undefined): Date | null => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split("-").map((part) => parseInt(part, 10));
    return new Date(year, month - 1, day); // Adjust month (0-based in JavaScript)
  };

  const formatDate = (dateString: string | undefined) => {
    const parsedDate = parseDate(dateString);
    if (!parsedDate) return "No Date";
    return parsedDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  const sortedEvents = events.sort((a, b) => {
    const dateA = parseDate(a.end_date || a.start_date)?.getTime() || 0;
    const dateB = parseDate(b.end_date || b.start_date)?.getTime() || 0;
    return dateA - dateB;
  });

  const groupedEvents = sortedEvents.reduce((acc: Record<string, Event[]>, event: Event) => {
    const date = event.end_date || event.start_date;
    const parsedDate = parseDate(date);
    const month = parsedDate
      ? parsedDate.toLocaleString("default", { month: "long" })
      : "Unknown Month";
    acc[month] = acc[month] || [];
    acc[month].push(event);
    return acc;
  }, {});

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen p-4 bg-stone-100">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Event Calendar</h1>
        {Object.entries(groupedEvents).map(([month, events]) => (
          <div key={month} className="p-4 mb-6 rounded-lg shadow-sm bg-white">
            <h2 className="text-lg font-bold mb-2 uppercase text-gray-700">{month}</h2>
            {events.map((event, index) => {
              const colorTheme =
                monthColors[
                  parseDate(event.end_date || event.start_date)?.toLocaleString("default", { month: "long" }) || "Unknown Month"
                ] || { bg: "bg-gray-300", text: "text-gray-700" };

              return (
                <div key={index} className="flex items-center mb-3">
                  <div
                    className={`ml-6 px-3 py-1 rounded-lg text-sm font-semibold mr-4 shadow ${colorTheme.bg} ${colorTheme.text}`}
                  >
                    {event.start_date && event.end_date
                      ? `${formatDate(event.start_date)} - ${formatDate(event.end_date)}`
                      : formatDate(event.start_date || event.end_date)}
                  </div>
                  <p className="text-gray-600">{event.description || "No Description"}</p>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCalendarPage;
