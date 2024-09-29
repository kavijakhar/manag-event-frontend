import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ListEvents from './components/events/ListEvents';
import EventForm from './components/events/CreateEvent';
import UpdateEvent from './components/events/UpdateEvent';
const existingEventData = {
  title: 'Sample Event',
  description: 'This is a sample event description.',
  startDate: '2024-09-30',
  endDate: '2024-10-01',
  totalGuests: 100,
  image: null, // Or provide an initial file if needed
};
const router = createBrowserRouter([
  {
    path: '/',
    element: <ListEvents />,
  },
  {
    path: '/create-event',
    element: <EventForm />,
  },
  {
    path: '/update-event/:eventId',
    element: <UpdateEvent initialEventData={existingEventData}/>,
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
