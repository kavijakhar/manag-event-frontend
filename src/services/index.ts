import axios, { AxiosResponse } from 'axios';

const API_URL = 'http://localhost:5000/events'; 

interface EventData {
  title: string;
  description: string;
  startDate: string; 
  endDate: string;
  totalGuests?: number;
  image?: File;
}

// Create an event
export const createEvent = async (eventData: EventData, userId: number): Promise<EventData> => {
  try {
    const response: AxiosResponse<EventData> = await axios.post(API_URL, { ...eventData, userId });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create event');
  }
};

export const getAllEvents = async (): Promise<EventData[]> => {
  try {
    const response: AxiosResponse<EventData[]> = await axios.get(API_URL);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch events');
  }
};

export const getEventById = async (eventId: string): Promise<EventData> => {
  try {
    const response: AxiosResponse<EventData> = await axios.get(`${API_URL}/${eventId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch event');
  }
};

export const updateEvent = async (eventId: string, eventData: EventData): Promise<EventData> => {
  try {
    const response: AxiosResponse<EventData> = await axios.put(`${API_URL}/${eventId}`, eventData);
    return response.data; 
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update event');
  }
};

// Delete an event
export const deleteEvent = async (eventId: string, userId: number): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/${eventId}`, { data: { userId } });
    return true;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete event');
  }
};
