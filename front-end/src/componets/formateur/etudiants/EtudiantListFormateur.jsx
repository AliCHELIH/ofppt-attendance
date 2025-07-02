import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { axiosClient } from '../../../config/Api/AxiosClient';
import { Box, Typography, Select, MenuItem, useTheme } from '@mui/material';
import { errorToast, successToast } from '../../../config/Toasts/toasts';
import { tokens } from '../../../theme';

export default function EtudiantListFormateur() {
    const [loadingPage, setLoadingPage] = useState(true);
    const [etudiants, setEtudiants] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [observationsFormateur, setObservationsFormateur] = useState({});


    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const observationsOptions = [
        'Très bon stagiaire.',
        'Stagiaire moyen.',
        'Besoin d\'amélioration.',
        'Excellent travail.',
        'Faible performance.'
    ];

    const getEtudiants = async () => {
        try {
            setLoadingPage(true);
            const { data } = await axiosClient.get(`designer/etudiants/group/${selectedGroup}`);
            setEtudiants(data);
            // Initialize observationsFormateur with the current observations
            const initialObservations = {};
            data.forEach(etudiant => {
                initialObservations[etudiant.id] = etudiant.observations_formateur || '';
            });
            setObservationsFormateur(initialObservations);
            setLoadingPage(false);
        } catch (error) {
            setLoadingPage(false);
            errorToast('Une erreur s\'est produite lors de la récupération des stagiaires');
        }
    };

    const getGroups = async () => {
        try {
            const { data } = await axiosClient.get("designer/groups");
            setGroups(data);
        } catch (error) {
            errorToast('Une erreur s\'est produite lors de la récupération des groupes');
        }
    }

    const handleGroupChange = (event) => {
        setSelectedGroup(event.target.value);
    };

    const handleObservationChange = async (id, observation) => {
        const updatedObservations = {
            ...observationsFormateur,
            [id]: observation
        };
        setObservationsFormateur(updatedObservations);

        try {
            await axiosClient.put(`designer/etudiants/${id}/updateObservation`, {
                observations_formateur: observation
            });
            successToast('Observation mise à jour avec succès');
        } catch (error) {
            errorToast('Une erreur s\'est produite lors de la mise à jour de l\'observation');
        }
    };

    useEffect(() => {
        getGroups();
    }, []);

    useEffect(() => {
        if (groups.length > 0) {
            setSelectedGroup(groups[0].id);
        }
    }, [groups]);

    useEffect(() => {
        if (selectedGroup) {
            getEtudiants();
        }
    }, [selectedGroup]);

    const columns = [
        { field: 'nom', headerName: 'Nom', flex: 1 },
        { field: 'prenom', headerName: 'Prenom', flex: 1 },
        { field: 'filiere', headerName: 'Filiere', flex: 3 },
        { field: 'groupe', headerName: 'Groupe', flex: 1 },
        {
            field: 'observation',
            headerName: 'Observation du Formateur',
            flex: 3,
            renderCell: (params) => (
                <Select
                    value={observationsFormateur[params.row.id] || ''}
                    onChange={(e) => handleObservationChange(params.row.id, e.target.value)}
                    fullWidth
                >
                    {observationsOptions.map((option, index) => (
                        <MenuItem key={index} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
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
        <Box sx={{ height: 600, width: '100%' }}>
            <Box display="flex" justifyContent="space-between" m="20px">
                <Typography variant="h4">
                    Liste des Stagiaires
                </Typography>
                <Select value={selectedGroup} onChange={handleGroupChange}>
                    {groups.map((group) => (
                        <MenuItem key={group.id} value={group.id}>
                            {group.nom}
                        </MenuItem>
                    ))}
                </Select>
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
