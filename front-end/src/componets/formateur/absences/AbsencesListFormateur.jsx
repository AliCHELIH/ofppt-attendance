import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { axiosClient } from '../../../config/Api/AxiosClient';
import { Box, Typography, Select, MenuItem } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import moment from 'moment';
import { tokens } from '../../../theme';
import { useTheme } from '@mui/material';
import { errorToast, successToast } from '../../../config/Toasts/toasts';

export default function AbsencesListFormateur() {
    const [loadingPage, setLoadingPage] = useState(true);
    const [etudiants, setEtudiants] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState([]);
    const [absenceData, setAbsenceData] = useState({});
    const [seance, setSeance] = useState('s1');
    const today = moment().format('YYYY-MM-DD');


    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const getEtudiants = async () => {
        try {
            setLoadingPage(true);
            const { data } = await axiosClient.get(`designer/etudiants/group/${selectedGroup}`);
            setEtudiants(data);
            // Initialize absenceData with all students set to false (Absent)
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
            const { data } = await axiosClient.get("designer/groups");
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
            date: today,
            seance,
        }));

        try {
            const response = await axiosClient.post('/designer/absences', absences);
            successToast(response.data.message, 1500, 'top-center');
        } catch (error) {
            console.error(error);
            errorToast(error.response.data.message, 1500, 'top-center');
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
        { field: 'nom', headerName: 'Nom', width: 150 },
        { field: 'prenom', headerName: 'Prenom', width: 150 },
        { field: 'filiere', headerName: 'Filiere', width: 150 },
        { field: 'groupe', headerName: 'Groupe', width: 150 },
        { field: 'cin', headerName: 'Cin', width: 150 },
        { field: 'numero_stagiaire', headerName: 'Numero de Telephone', width: 160 },
        { field: 'numero_parent', headerName: 'Numero de Parent', width: 160 },
        {
            field: 'absence',
            headerName: 'Présent',
            width: 120,
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
            <Box display="flex" justifyContent="space-between" m="20px">
                <Typography variant="h4">
                    Aujourd&apos;hui {today}
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
                m="40px 0 0 0"
                height="65vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .name-column--cell": {
                        color: colors.greenAccent[300],
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.grey[900],
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
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
