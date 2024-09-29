import axios, { AxiosResponse } from 'axios';

// Set the base URL for the API
const API_URL = 'http://localhost:5000/events'; // Replace with your actual API URL

// Define TypeScript interfaces for your event data
interface EventData {
  title: string;
  description: string;
  startDate: string; // Use Date if you prefer handling Date objects
  endDate: string;   // Use Date if you prefer handling Date objects
  totalGuests?: number;
  image?: File; // If you are handling file uploads
}

// Create an event
export const createEvent = async (eventData: EventData, userId: number): Promise<EventData> => {
  try {
    const response: AxiosResponse<EventData> = await axios.post(API_URL, { ...eventData, userId });
    return response.data; // Return the created event
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create event');
  }
};

// Get all events
export const getAllEvents = async (): Promise<EventData[]> => {
  try {
    const response: AxiosResponse<EventData[]> = await axios.get(API_URL);
    return response.data; // Return the list of events
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch events');
  }
};

// Get a single event by ID
export const getEventById = async (eventId: string): Promise<EventData> => {
  try {
    const response: AxiosResponse<EventData> = await axios.get(`${API_URL}/${eventId}`);
    return response.data; // Return the event details
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch event');
  }
};

// Update an event
export const updateEvent = async (eventId: string, eventData: EventData): Promise<EventData> => {
  try {
    const response: AxiosResponse<EventData> = await axios.put(`${API_URL}/${eventId}`, eventData);
    return response.data; // Return the updated event
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update event');
  }
};

// Delete an event
export const deleteEvent = async (eventId: string, userId: number): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/${eventId}`, { data: { userId } });
    return true; // Indicate success
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete event');
  }
};
