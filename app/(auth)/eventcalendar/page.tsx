"use client";
import React, { useEffect, useState } from "react";
import { fetchRecords } from "@/utils/airtable";

const monthColors: { [key: string]: { bg: string; text: string } } = {
  January: { bg: "bg-[#F4B2A3]", text: "text-[#7A3D2C]" }, // Soft Peach background, Dark Brown text
  February: { bg: "bg-[#C49AC8]", text: "text-[#5F3A64]" }, // (unchanged)
  March: { bg: "bg-[#C6E6E4]", text: "text-[#3D6261]" }, // (unchanged)
  April: { bg: "bg-[#FF6B6B]", text: "text-[#8C2E2E]" }, // Vibrant Coral background, Dark Red text
  May: { bg: "bg-[#73B75B]", text: "text-[#2C4E1C]" }, // (unchanged)
  June: { bg: "bg-[#F7D455]", text: "text-[#8C6A11]" }, // (unchanged)
  July: { bg: "bg-[#F5C1CB]", text: "text-[#7A4C52]" }, // (unchanged)
  August: { bg: "bg-[#F68A4B]", text: "text-[#8C4A24]" }, // (unchanged)
  September: { bg: "bg-[#496FC2]", text: "text-[#1E3466]" }, // (unchanged)
  October: { bg: "bg-[#8BB7D8]", text: "text-[#3A5B77]" }, // (unchanged)
  November: { bg: "bg-[#F27891]", text: "text-[#7A2E3E]" }, // Light Salmon background, Dark Pink text
  December: { bg: "bg-[#49C5D6]", text: "text-[#2A5E66]" }, // Light Cyan background, Deep Teal text
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

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "No Date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  const sortedEvents = events.sort((a, b) => {
    const endDateA = a.fields["End Date"] ? new Date(a.fields["End Date"]) : new Date(a.fields["Start Date"]);
    const endDateB = b.fields["End Date"] ? new Date(b.fields["End Date"]) : new Date(b.fields["Start Date"]);
    return endDateA.getTime() - endDateB.getTime();
  });

  const groupedEvents = sortedEvents.reduce((acc: any, event: any) => {
    const date = event.fields["End Date"] || event.fields["Start Date"];
    const month = new Date(date).toLocaleString("default", { month: "long" });
    acc[month] = acc[month] || [];
    acc[month].push(event.fields);
    return acc;
  }, {});

  return (
    <div className="min-h-screen p-4 bg-stone-100">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Event Calendar</h1>
        {Object.entries(groupedEvents).map(([month, events]: any) => (
          <div key={month} className="p-4 mb-6 rounded-lg shadow-sm bg-white">
            <h2 className="text-lg font-bold mb-2 uppercase text-gray-700">{month}</h2>
            {events.map((event: any, index: number) => {
              const startDate = event["Start Date"];
              const endDate = event["End Date"];
              const colorTheme =
                monthColors[
                  new Date(endDate || startDate).toLocaleString("default", { month: "long" })
                ] || { bg: "bg-gray-300", text: "text-gray-700" };

              return (
                <div key={index} className="flex items-center mb-3">
                  {/* Date Section with Background and Matched Text Color */}
                  <div
                    className={`ml-6 px-3 py-1 rounded-lg text-sm font-semibold mr-4 shadow ${colorTheme.bg} ${colorTheme.text}`}
                  >
                    {startDate && endDate
                      ? `${formatDate(startDate)} - ${formatDate(endDate)}`
                      : startDate
                      ? formatDate(startDate)
                      : endDate
                      ? formatDate(endDate)
                      : "No Date"}
                  </div>
                  {/* Description */}
                  <p className="text-gray-600">{event.Description || "No Description"}</p>
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
