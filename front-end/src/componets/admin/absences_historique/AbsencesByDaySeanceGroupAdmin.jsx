import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { axiosClient } from '../../../config/Api/AxiosClient';
import { Box, Select, MenuItem, TextField, Button } from '@mui/material';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { tokens } from '../../../theme';
import { useTheme } from '@mui/material';
import { errorToast } from '../../../config/Toasts/toasts';

export default function AbsencesByDaySeanceGroupAdmin() {
    const [loading, setLoading] = useState(false);
    const [etudiants, setEtudiants] = useState([]);
    const [date, setDate] = useState(new Date());
    const [seance, setSeance] = useState('s1');
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const fetchGroups = async () => {
        try {
            const { data } = await axiosClient.get('/admin/groups');
            setGroups(data);
            if (data.length > 0) {
                setSelectedGroup(data[0].id);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAbsences = async () => {
        setLoading(true);
        const selectedDate = moment(date).format('YYYY-MM-DD');
        try {
            const { data } = await axiosClient.get('/admin/absencesByDaySeanceGroup', {
                params: {
                    date: selectedDate,
                    seance: seance,
                    group_id: selectedGroup,
                },
            });
            setEtudiants(data);
            setLoading(false);
        } catch (error) {
            errorToast(error.response.data.message, 1500, 'top-center');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    useEffect(() => {
        console.log(etudiants);
    }, [etudiants]);

    const handleSeanceChange = (event) => {
        setSeance(event.target.value);
    };

    const handleGroupChange = (event) => {
        setSelectedGroup(event.target.value);
    };

    const handleFetchAbsences = () => {
        fetchAbsences();
    };

    const columns = [
        { field: 'nom', headerName: 'Nom', flex: 0.8 },
        { field: 'prenom', headerName: 'Prenom', flex: 0.8 },
        { field: 'filiere', headerName: 'Filiere', flex: 1.7 },
        { field: 'groupe', headerName: 'Groupe', flex: 0.6 },
        { field: 'cin', headerName: 'Cin', flex: 0.6 },
        { field: 'numero_stagiaire', headerName: 'Numero de Telephone', flex: 1.2 },
        { field: 'numero_parent', headerName: 'Numero de Parent', flex: 1.2 },
        {
            field: 'statut',
            headerName: 'Statut',
            flex: 0.8,
            renderCell: (params) => {
                const isJustified = params.row.is_justified;
                const status = params.value;
                console.log(params.row);
                console.log("status", status);
                console.log("isJustified", isJustified);
                if (status === 'Absent' && isJustified === 1) {
                    return <span style={{ color: 'blue' }}>
                        Absence Justifié
                    </span>
                }

                return (
                    <span style={{ color: status === 'Présent' ? 'green' : 'red' }}>
                        {status}
                    </span>
                );
            },
        },
    ];

    const rows = etudiants.map((etudiant) => ({
        id: etudiant.id,
        nom: etudiant.nom,
        prenom: etudiant.prenom,
        filiere: etudiant.filiere,
        groupe: etudiant.groupe,
        cin: etudiant.cin,
        numero_stagiaire: etudiant.numero_stagiaire,
        numero_parent: etudiant.numero_parent,
        statut: etudiant.statut,
        is_justified: etudiant.is_justified,
    }));

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <Box display="flex" justifyContent="space-between" sx={{ ml: 2, mr: 3, mb: 3, mt: 2, width: '96%' }}>
                <DatePicker
                    selected={date}
                    onChange={(newDate) => setDate(newDate)}
                    dateFormat="yyyy-MM-dd"
                    customInput={<TextField label="Select Date" />}
                />
                <Select value={seance} onChange={handleSeanceChange}>
                    <MenuItem value="s1">Séance 1</MenuItem>
                    <MenuItem value="s2">Séance 2</MenuItem>
                    <MenuItem value="s3">Séance 3</MenuItem>
                    <MenuItem value="s4">Séance 4</MenuItem>
                </Select>
                <Select value={selectedGroup} onChange={handleGroupChange}>
                    {groups.map((group) => (
                        <MenuItem key={group.id} value={group.id}>
                            {group.nom}
                        </MenuItem>
                    ))}
                </Select>
                <Button variant="contained" color="primary" onClick={handleFetchAbsences} sx={{ backgroundColor: colors.greenAccent[400] }}>
                    Voir les absences
                </Button>
            </Box>
            <Box
                sx={{
                    height: 600,
                    width: '96%',
                    ml: 2,
                }}
            >
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    loading={loading}
                    checkboxSelection={false}
                />
            </Box>
        </Box>
    );
}
