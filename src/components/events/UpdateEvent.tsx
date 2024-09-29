import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Container, Row, Col, Form as BootstrapForm } from 'react-bootstrap';

interface EventFormValues {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    totalGuests?: number;
    image: File | null;
}

interface UpdateEventProps {
    initialEventData: EventFormValues;
}

const UpdateEvent: React.FC<UpdateEventProps> = ({ initialEventData }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const validationSchema = Yup.object({
        title: Yup.string().required('Event title is required'),
        description: Yup.string().required('Description is required'),
        startDate: Yup.date().required('Start date is required').nullable(),
        endDate: Yup.date().required('End date is required').nullable(),
        totalGuests: Yup.number().min(1, 'Guests must be greater than 0').optional(),
        image: Yup.mixed().optional(),
    });

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files?.[0] || null;
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
        } else {
            setPreviewImage(null);
        }
    };

    const handleUpdate = (values: EventFormValues) => {
        setIsSubmitting(true);
        console.log('Updated Event Data:', values);

        setIsSubmitting(false);
    };

    return (
        <Container style={{
            backgroundColor: 'rgb(236 236 236)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            borderRadius: '8px',
            marginTop: '20px'
        }}>
            <Row className="justify-content-md-center mt-5">
                <Col xs={12} md={8}>
                    <h3>Update Event</h3>
                    <Formik
                        initialValues={initialEventData}
                        validationSchema={validationSchema}
                        onSubmit={handleUpdate}
                        validateOnSubmit={true}
                    >
                        {({ setFieldValue, errors, touched }) => (
                            <Form>
                                <Row>
                                    <Col>
                                        <BootstrapForm.Group>
                                            <BootstrapForm.Label>Event Title</BootstrapForm.Label>
                                            <Field
                                                name="title"
                                                type="text"
                                                className={`form-control ${touched.title && errors.title ? 'is-invalid' : ''}`}
                                                placeholder="Enter event title"
                                            />
                                            <ErrorMessage name="title" component="div" className="text-danger" />
                                        </BootstrapForm.Group>
                                    </Col>

                                    <Col>
                                        <BootstrapForm.Group>
                                            <BootstrapForm.Label>Description</BootstrapForm.Label>
                                            <Field
                                                name="description"
                                                as="textarea"
                                                className={`form-control ${touched.description && errors.description ? 'is-invalid' : ''}`}
                                                placeholder="Enter event description"
                                            />
                                            <ErrorMessage name="description" component="div" className="text-danger" />
                                        </BootstrapForm.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <BootstrapForm.Group className="mt-3">
                                            <BootstrapForm.Label>Start Date</BootstrapForm.Label>
                                            <Field
                                                name="startDate"
                                                type="date"
                                                className={`form-control ${touched.startDate && errors.startDate ? 'is-invalid' : ''}`}
                                            />
                                            <ErrorMessage name="startDate" component="div" className="text-danger" />
                                        </BootstrapForm.Group>
                                    </Col>
                                    <Col>
                                        <BootstrapForm.Group className="mt-3">
                                            <BootstrapForm.Label>End Date</BootstrapForm.Label>
                                            <Field
                                                name="endDate"
                                                type="date"
                                                className={`form-control ${touched.endDate && errors.endDate ? 'is-invalid' : ''}`}
                                            />
                                            <ErrorMessage name="endDate" component="div" className="text-danger" />
                                        </BootstrapForm.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <BootstrapForm.Group className="mt-3">
                                            <BootstrapForm.Label>Total Guests (Optional)</BootstrapForm.Label>
                                            <Field
                                                name="totalGuests"
                                                type="number"
                                                className={`form-control ${touched.totalGuests && errors.totalGuests ? 'is-invalid' : ''}`}
                                                placeholder="Enter total guests"
                                            />
                                            <ErrorMessage name="totalGuests" component="div" className="text-danger" />
                                        </BootstrapForm.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <BootstrapForm.Group className="mt-3">
                                            <BootstrapForm.Label>Event Image</BootstrapForm.Label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(event) => {
                                                    handleImageChange(event);
                                                    setFieldValue('image', event.currentTarget.files?.[0] || null); // Set image in Formik state
                                                }}
                                                className={`form-control ${touched.image && errors.image ? 'is-invalid' : ''}`}
                                            />
                                            <ErrorMessage name="image" component="div" className="text-danger" />
                                            {previewImage && (
                                                <div style={{ marginTop: '10px' }}>
                                                    <img
                                                        src={previewImage}
                                                        alt="Preview"
                                                        style={{ width: '100px', height: '100px', marginTop: '10px' }}
                                                    />
                                                </div>
                                            )}
                                        </BootstrapForm.Group>
                                    </Col>
                                </Row>

                                <Button variant="primary" type="submit" className="mt-4" disabled={isSubmitting}>
                                    {isSubmitting ? 'Updating Event...' : 'Update Event'}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Col>
            </Row>
        </Container>
    );
};

export default UpdateEvent;
