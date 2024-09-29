import React, { useEffect, useState } from 'react';
import { Button, Table, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiEdit, FiTrash2, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import FilterSidebar from './FilterSidebar'; // Import the FilterSidebar
import { useQuery } from '@tanstack/react-query';
import { deleteEvent, getAllEvents } from '../../services';
import moment from 'moment';
import { toast } from 'react-toastify';

interface Event {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    totalGuests?: number;
}

const ListEvents: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [eventsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Event; direction: 'ascending' | 'descending' } | null>(null);
    const [events, setEvents] = useState<Event[]>([])
    const filteredEvents = events.filter(event => {
        const isNameMatch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
        const isStartDateMatch = startDate ? new Date(event.startDate) >= new Date(startDate) : true;
        const isEndDateMatch = endDate ? new Date(event.endDate) <= new Date(endDate) : true;
        return isNameMatch && isStartDateMatch && isEndDateMatch;
    });

    const dateFormatter = (
        dateString: string | undefined,
        formatObj?: { format?: string; addTime: boolean }
    ): string => {
        const { format = "MMM DD, YY", addTime = false } = formatObj || {};

        if (!dateString) {
            return " -- ";
        }

        if (addTime) {
            return moment(dateString).format("MMM DD, YY h:mm A");
        } else {
            return moment(dateString).format(format);
        }
    };
    // Queries
    const { data, isLoading, isError, refetch } = useQuery({ queryKey: ['events'], queryFn: getAllEvents })

    useEffect(() => {
        if (data) {
            const events: any = data || [];
            setEvents(events)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const sortedEvents = React.useMemo(() => {
        let sortableEvents = [...filteredEvents];
        if (sortConfig) {
            sortableEvents.sort((a: any, b: any) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableEvents;
    }, [filteredEvents, sortConfig]);

    const handleSort = (key: keyof Event) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = sortedEvents.slice(indexOfFirstEvent, indexOfLastEvent);

    const handleDelete = async (id: string) => {
        try {
            const res: any = await deleteEvent(id, 1);
            if (res) {
                toast.success('Event deleted successfully!')
                refetch()
            } else {
                toast.error('Failed to delete event. Please try again.')
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            toast.error('An error occurred while deleting the event.')
        }
    };

    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

    if (isError) {
        return <div>Error fetching events</div>; // Handle errors gracefully
    }
    return (
        <section className='mx-4'>
            <div>
                <Row className="my-3 header align-items-center justify-content-between">
                    <Col md={8}>
                        <h2 className="font-weight-bold text-uppercase">Upcoming Events</h2>
                        <p className="text-muted">Manage and organize your events effortlessly</p>
                    </Col>
                    <Col style={{ marginLeft: '250px' }}>
                        <Link to="/create-event">
                            <Button variant="primary">Create New Event</Button>
                        </Link>
                    </Col>
                </Row>
            </div>
            <Row>
                <Col md={3}>
                    <FilterSidebar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                    />
                </Col>
                <Col md={9}>
                    {isLoading ? (
                        <div>Loading events...</div>
                    ) : currentEvents.length > 0 ? (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th onClick={() => handleSort('name')}>
                                        Name
                                        {sortConfig?.key === 'name' && (sortConfig.direction === 'ascending' ? <FiArrowUp className="ml-1" /> : <FiArrowDown className="ml-1" />)}
                                    </th>
                                    <th>Description</th>
                                    <th onClick={() => handleSort('startDate')}>
                                        Start Date
                                        {sortConfig?.key === 'startDate' && (sortConfig.direction === 'ascending' ? <FiArrowUp className="ml-1" /> : <FiArrowDown className="ml-1" />)}
                                    </th>
                                    <th onClick={() => handleSort('endDate')}>
                                        End Date
                                        {sortConfig?.key === 'endDate' && (sortConfig.direction === 'ascending' ? <FiArrowUp className="ml-1" /> : <FiArrowDown className="ml-1" />)}
                                    </th>
                                    <th>Total Guests</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEvents.map((event, index) => (
                                    <tr key={event.id}>
                                        <td>{index + 1 + indexOfFirstEvent}</td>
                                        <td>{event.name}</td>
                                        <td>{event.description}</td>
                                        <td>{dateFormatter(event.startDate)}</td>
                                        <td>{dateFormatter(event.endDate)}</td>
                                        <td>{event.totalGuests || 'N/A'}</td>
                                        <td>
                                            <Link to={`/update-event/${event.id}`}>
                                                <Button size="sm" className="mr-4">
                                                    <FiEdit /> Edit
                                                </Button>
                                            </Link>
                                            <Button style={{ marginLeft: '7px' }} size="sm" onClick={() => handleDelete(event.id)}>
                                                <FiTrash2 /> Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <div>No events available.</div> 
                    )}

                    <Row className="my-3">
                        <Col className='d-flex justify-content-between'>
                            <Button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                Previous
                            </Button>
                            <Button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                Next
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </section>
    );
};

export default ListEvents;
