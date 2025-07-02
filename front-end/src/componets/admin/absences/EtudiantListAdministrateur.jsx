import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { axiosClient } from '../../../config/Api/AxiosClient';
import { Box, Typography, Select, MenuItem, TextField } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { tokens } from '../../../theme';
import { useTheme } from '@mui/material';
import { errorToast, successToast } from '../../../config/Toasts/toasts';

export default function EtudiantListAdministrateur() {
    const [loadingPage, setLoadingPage] = useState(true);
    const [etudiants, setEtudiants] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState([]);
    const [absenceData, setAbsenceData] = useState({});
    const [seance, setSeance] = useState('s1');
    const [selectedDate, setSelectedDate] = useState(new Date());

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const getEtudiants = async () => {
        try {
            setLoadingPage(true);
            const { data } = await axiosClient.get(`admin/etudiants/group/${selectedGroup}`);
            setEtudiants(data);
            const initialAbsenceData = {};
            data.forEach(etudiant => {
                initialAbsenceData[etudiant.id] = false;
            });
            setAbsenceData(initialAbsenceData);
            setLoadingPage(false);
        } catch (error) {
            setLoadingPage(false);
            console.log(error);
        }
    };

    const getGroups = async () => {
        try {
            const { data } = await axiosClient.get("admin/groups");
            setGroups(data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleCheckboxChange = (id, checked) => {
        setAbsenceData({
            ...absenceData,
            [id]: checked,
        });
    };

    const handleSeanceChange = (event) => {
        setSeance(event.target.value);
    };

    const handleGroupChange = (event) => {
        setSelectedGroup(event.target.value);
    };

    const handleSubmit = async () => {
        const absences = etudiants.map(etudiant => ({
            etudiant_id: etudiant.id,
            statut: absenceData[etudiant.id] ? 'Présent' : 'Absent',
            date: moment(selectedDate).format('YYYY-MM-DD'),
            seance,
        }));

        try {
            const response = await axiosClient.post('/admin/absences', absences);
            successToast(response.data.message, 1500, 'top-center');
        } catch (error) {
            console.error(error.response.data.message);
            errorToast(error.response.data.message ? error.response.data.message : 'La date est invalide', 1500, 'top-center');
        }
    };

    useEffect(() => {
        getGroups();
    }, []);

    useEffect(() => {
        setSelectedGroup(groups[0]?.id);
    }, [groups]);

    useEffect(() => {
        if (selectedGroup) {
            getEtudiants();
        }
    }, [selectedGroup]);

    const columns = [
        { field: 'nom', headerName: 'Nom', flex: 1 },
        { field: 'prenom', headerName: 'Prenom', flex: 1 },
        { field: 'filiere', headerName: 'Filiere', flex: 1.8 },
        { field: 'groupe', headerName: 'Groupe', flex: 1 },
        { field: 'cin', headerName: 'Cin', flex: 1 },
        { field: 'numero_stagiaire', headerName: 'Numero de Telephone', flex: 1.2 },
        { field: 'numero_parent', headerName: 'Numero de Parent', flex: 1.2 },
        {
            field: 'absence',
            headerName: 'Présent',
            flex: 0.7,
            renderCell: (params) => (
                <Checkbox
                    checked={absenceData[params.row.id] || false}
                    onChange={(e) => handleCheckboxChange(params.row.id, e.target.checked)}
                />
            ),
        },
    ];

    const rows = etudiants.map((etudiant) => ({
        id: etudiant.id,
        nom: etudiant.nom,
        prenom: etudiant.prenom,
        filiere: etudiant.group?.filiere?.nom,
        groupe: etudiant.group?.nom,
        cin: etudiant.cin,
        numero_stagiaire: etudiant.numero_stagiaire,
        numero_parent: etudiant.numero_parent,
    }));

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <Box display="flex" justifyContent="space-between" sx={{ ml: 2, mr: 3, mb: 3, mt: 2, width: '96%' }}>
                <Typography variant="h4">
                    <DatePicker
                        selected={selectedDate}
                        onChange={(newDate) => setSelectedDate(newDate)}
                        dateFormat="yyyy-MM-dd"
                        customInput={<TextField label="Select Date" />}
                    />
                </Typography>
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
                <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ backgroundColor: colors.greenAccent[400] }}>
                    Marquer les absences
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
                    loading={loadingPage}
                    checkboxSelection={false}
                />
            </Box>
        </Box>
    );
}
