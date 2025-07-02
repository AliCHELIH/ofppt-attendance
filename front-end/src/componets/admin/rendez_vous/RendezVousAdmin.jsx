import { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { axiosClient } from '../../../config/Api/AxiosClient';
import { Container, Typography, Box } from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

function RendezVousAdmin() {
    const [appointments, setAppointments] = useState([]);

    const fetchAppointments = async () => {
        const response = await axiosClient.get('/admin/appointments');
        setAppointments(response.data);
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const events = appointments.map((appointment) => ({
        id: appointment.id,
        title: `${appointment.validator.first_name} ${appointment.validator.last_name} avec ${appointment.etudiant.prenom} ${appointment.etudiant.nom}`,
        start: new Date(appointment.rdv_time),
        end: new Date(new Date(appointment.rdv_time).setHours(new Date(appointment.rdv_time).getHours() + 1)),
        status: appointment.status,
    }));

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Liste des Rendez-vous
            </Typography>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500, margin: '50px' }}
                messages={{
                    next: "Suivant",
                    previous: "Précédent",
                    today: "Aujourd'hui",
                    month: "Mois",
                    week: "Semaine",
                    day: "Jour",
                }}
                eventPropGetter={(event) => ({
                    style: {
                        backgroundColor: event.status === 'passed' ? 'green' : event.status === 'cancelled' ? 'red' : 'blue',
                        color: 'white',
                    },
                })}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            </Box>
        </Container>
    );
}

export default RendezVousAdmin;
