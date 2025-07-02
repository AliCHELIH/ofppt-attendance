import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { axiosClient } from '../../../config/Api/AxiosClient';
import {
    Container, MenuItem, Select, Button, InputLabel, FormControl, Typography, Modal, Box, CircularProgress, TextField
} from '@mui/material';
import { errorToast, successToast } from '../../../config/Toasts/toasts';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAppContext } from '../../../config/context/ComponentContext';

const localizer = momentLocalizer(moment);

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};

function Appointments() {
    const [date, setDate] = useState(new Date());
    const [appointments, setAppointments] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [etudiants, setEtudiants] = useState([]);
    const [newAppointment, setNewAppointment] = useState({
        etudiant_id: '',
        validator_id: '',
        rdv_time: date,
        status: 'pending',
    });
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [submittingLoading, setSubmittingLoading] = useState(false);

    const { user } = useAppContext();

    const fetchGroups = async () => {
        const response = await axiosClient.get('/validator/groups');
        setGroups(response.data);
        if (response.data.length > 0) {
            setSelectedGroup(response.data[0].id);
        }
    };

    const fetchAppointments = async () => {
        const response = await axiosClient.get('/validator/appointments');
        setAppointments(response.data);
    };

    const fetchEtudiants = async (groupId) => {
        const response = await axiosClient.get(`/validator/etudiants/group/${selectedGroup}`, {
            params: { group_id: groupId }
        });
        setEtudiants(response.data);
    };

    useEffect(() => {
        fetchGroups();
        fetchAppointments();
    }, []);

    useEffect(() => {
        if (selectedGroup) {
            fetchEtudiants(selectedGroup);
        }
    }, [selectedGroup]);

    const handleDateChange = (date) => {
        setDate(date);
        setNewAppointment({ ...newAppointment, rdv_time: date });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAppointment({ ...newAppointment, [name]: value });
    };

    const handleStatusChange = async (status) => {
        try {
            setSubmittingLoading(true);
            await axiosClient.put(`/validator/appointments/${selectedAppointment.id}`, { status });
            successToast('Statut mis à jour');
            setModalOpen(false);
            fetchAppointments();
        } catch (error) {
            errorToast(error.response.data.message);
        } finally {
            setSubmittingLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmittingLoading(true);
            const formattedDate = newAppointment.rdv_time.toISOString().split('.')[0] + 'Z';
            await axiosClient.post('/validator/appointments', { ...newAppointment, rdv_time: formattedDate });
            successToast('Rendez-vous ajouté');
            fetchAppointments();
        } catch (error) {
            errorToast(error.response.data.message);
        } finally {
            setSubmittingLoading(false);
        }
    };

    const handleEventClick = (event) => {
        setSelectedAppointment(event);
        setModalOpen(true);
    };

    const events = appointments.map((appointment) => ({
        id: appointment.id,
        title: `${appointment.etudiant.prenom} ${appointment.etudiant.nom}`,
        start: new Date(appointment.rdv_time),
        end: new Date(new Date(appointment.rdv_time).setHours(new Date(appointment.rdv_time).getHours() + 1)),
        status: appointment.status,
    }));

    if (!user?.is_conseiller) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <Typography variant="h1" component="h1">
                    Vous ne pouvez pas accéder à cette page
                </Typography>
            </Box>
        )
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Gérer les Rendez-vous
            </Typography>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="group-label">Groupe</InputLabel>
                    <Select
                        labelId="group-label"
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                        required
                    >
                        {groups.map((group) => (
                            <MenuItem key={group.id} value={group.id}>
                                {group.nom}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="etudiant-label">Stagiaire</InputLabel>
                    <Select
                        labelId="etudiant-label"
                        name="etudiant_id"
                        value={newAppointment.etudiant_id}
                        onChange={handleInputChange}
                        required
                    >
                        {etudiants.map((etudiant) => (
                            <MenuItem key={etudiant.id} value={etudiant.id}>
                                {etudiant.prenom} {etudiant.nom}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <DatePicker
                        selected={date}
                        onChange={handleDateChange}
                        showTimeSelect
                        dateFormat="MMMM d, yyyy h:mm aa"
                        timeFormat="HH:mm"
                        timeIntervals={60}
                        timeCaption="time"
                        customInput={<TextField label="Sélectionnez la date et l'heure" variant="outlined" />}
                    />
                </FormControl>
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={submittingLoading}
                >
                    {submittingLoading ? <CircularProgress size={12} /> : 'Ajouter un rendez-vous'}
                </Button>
            </form>

            <Typography variant="h6" gutterBottom style={{ marginTop: '2rem' }}>
                Liste des rendez-vous
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
                onSelectEvent={handleEventClick}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            </Box>

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
                        Modifier le statut du rendez-vous
                    </Typography>
                    {selectedAppointment?.status === 'pending' ? (
                        <FormControl fullWidth margin="normal" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => handleStatusChange('passed')}
                                disabled={submittingLoading}
                                sx={{ marginBottom: '1rem' }}
                            >
                                {submittingLoading ? <CircularProgress size={12} /> : 'Marquer comme passé'}
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleStatusChange('cancelled')}
                                disabled={submittingLoading}
                            >
                                {submittingLoading ? <CircularProgress size={12} /> : 'Marquer comme annulé'}
                            </Button>
                        </FormControl>
                    ) : (
                        <Typography variant="h6">
                            {selectedAppointment?.status === 'passed' ? 'Déjà passé' : 'Déjà annulé'}
                        </Typography>
                    )}
                    <Button variant="contained" onClick={() => setModalOpen(false)} sx={{ marginTop: '1rem' }}>
                        Fermer
                    </Button>
                </Box>
            </Modal>
        </Container>
    );
}

export default Appointments;
