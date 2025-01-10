// utils/eventcalendar/getEventsByMajorId.ts
import axios from "axios";
import { Event } from "@/models/Event";

const getEventsByMajorId = async (majorId: number): Promise<Event[]> => {
  try {
    const response = await axios.get<Event[]>(
      `https://project-service.kunmhing.me/calendar/GetByMajorID/${majorId}`,
      {
        headers: { Accept: "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export default getEventsByMajorId;
