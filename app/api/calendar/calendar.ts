'use server'
import axios from "axios";
import { Event } from "@/models/Event";

const BASE_URL = "https://project-service.kunmhing.me/calendar";

// Fetch events by major ID
export const fetchEvents = async (majorId: number = 4): Promise<Event[]> => {
  try {
    const response = await axios.get<Event[]>(
      `${BASE_URL}/GetByMajorID/${majorId}`,
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

// Create a new event
export const createEvent = async (event: Partial<Event>): Promise<Event> => {
  try {
    const response = await axios.post<Event>(
      BASE_URL,
      {
        ...event,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

export const updateEvent = async (
  id: number,
  event: Partial<Event>
): Promise<void> => {
  try {
    await axios.put(
      BASE_URL,
      {
        ...event,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

// Delete an event by ID
export const deleteEvent = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/${id}`, {
      headers: { Accept: "application/json" },
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};
