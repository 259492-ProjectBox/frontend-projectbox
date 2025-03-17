"use client";

import React, { useEffect, useState } from "react";
import getEventsByMajorId from "@/app/api/calendar/getEventsByMajorId";
import { Event } from "@/models/Event";
import Spinner from "@/components/Spinner";

const monthColors: Record<string, { bg: string; text: string }> = {
  January: { bg: "bg-[#F8D7DA]", text: "text-[#8B0000]" },
  February: { bg: "bg-[#F3E5F5]", text: "text-[#6A1B9A]" },
  March: { bg: "bg-[#E8F5E9]", text: "text-[#1B5E20]" },
  April: { bg: "bg-[#FFEBEE]", text: "text-[#B71C1C]" },
  May: { bg: "bg-[#E0F2F1]", text: "text-[#004D40]" },
  June: { bg: "bg-[#FFFDE7]", text: "text-[#F57F17]" },
  July: { bg: "bg-[#F3E5F5]", text: "text-[#4A148C]" },
  August: { bg: "bg-[#FFF3E0]", text: "text-[#E65100]" },
  September: { bg: "bg-[#E3F2FD]", text: "text-[#0D47A1]" },
  October: { bg: "bg-[#E8EAF6]", text: "text-[#1A237E]" },
  November: { bg: "bg-[#F8D7DA]", text: "text-[#8B0000]" },
  December: { bg: "bg-[#E0F7FA]", text: "text-[#006064]" },
};

const thaiMonths: Record<string, string> = {
  January: "มกราคม",
  February: "กุมภาพันธ์",
  March: "มีนาคม",
  April: "เมษายน",
  May: "พฤษภาคม",
  June: "มิถุนายน",
  July: "กรกฎาคม",
  August: "สิงหาคม",
  September: "กันยายน",
  October: "ตุลาคม",
  November: "พฤศจิกายน",
  December: "ธันวาคม",
};

const formatDateToThai = (date: string): string => {
  const [day, month, year] = date.split("-");
  return `${day}/${month}/${year}`;
};

const EventCalendarPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const records = await getEventsByMajorId(4); // Replace `4` with the desired major ID
        setEvents(records || []); // Ensure that records is never null
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const sortedEvents = events.sort((a, b) => {
    const dateA = new Date(a.start_date.split("-").reverse().join("-")).getTime();
    const dateB = new Date(b.start_date.split("-").reverse().join("-")).getTime();
    return dateA - dateB;
  });

  const groupedEvents = sortedEvents.reduce((acc: Record<string, Event[]>, event: Event) => {
    const date = event.start_date;
    const month = new Date(date.split("-").reverse().join("-")).toLocaleString("default", { month: "long" });
    acc[month] = acc[month] || [];
    acc[month].push(event);
    return acc;
  }, {});

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen p-4 bg-stone-100">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">ปฏิทินกิจกรรม</h1>
        {Object.entries(groupedEvents).map(([month, events]) => (
          <div key={month} className="p-4 mb-6 rounded-lg shadow-sm bg-white">
            <h2 className="text-xl font-bold mb-4 uppercase text-gray-800">{thaiMonths[month] || month}</h2>
            {events.map((event, index) => {
              const colorTheme =
                monthColors[
                  new Date(event.start_date.split("-").reverse().join("-")).toLocaleString("default", { month: "long" })
                ] || { bg: "bg-gray-300", text: "text-gray-700" };

              return (
                <div key={index} className="mb-4">
                  <div className="flex items-start">
                    <div
                      className={`px-4 py-2 rounded-lg text-sm font-semibold shadow ${colorTheme.bg} ${colorTheme.text}`}
                    >
                      {event.start_date && event.end_date
                        ? `${formatDateToThai(event.start_date)} - ${formatDateToThai(event.end_date)}`
                        : formatDateToThai(event.start_date || event.end_date || "")}
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-bold text-gray-900 text-lg">{event.title}</p>
                      <p className="text-gray-700 mt-1 text-sm">{event.description || "ไม่มีคำอธิบาย"}</p>
                    </div>
                  </div>
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