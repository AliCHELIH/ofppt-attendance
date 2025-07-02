import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { axiosClient } from '../../../config/Api/AxiosClient';
import { Box, Typography, Select, MenuItem, useTheme } from '@mui/material';
import { errorToast, successToast } from '../../../config/Toasts/toasts';
import { tokens } from '../../../theme';
import { useAppContext } from '../../../config/context/ComponentContext';

export default function EtudiantListReview() {
    const [loadingPage, setLoadingPage] = useState(true);
    const [etudiants, setEtudiants] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [observationsConseiller, setObservationsConseiller] = useState({});
    const { user } = useAppContext();

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);


    const observationsOptions = [
        'Un stagiaire très prometteur.',
        'Bon stagiaire.',
        'Doit travailler plus dur.',
        'Excellente attitude.',
        'Doit améliorer sa performance.'
    ];

    const getEtudiants = async () => {
        try {
            setLoadingPage(true);
            const { data } = await axiosClient.get(`validator/etudiants/group/${selectedGroup}`);
            setEtudiants(data);
            // Initialize observationsConseiller with the current observations
            const initialObservations = {};
            data.forEach(etudiant => {
                initialObservations[etudiant.id] = etudiant.observations_conseiller || '';
            });
            setObservationsConseiller(initialObservations);
            setLoadingPage(false);
        } catch (error) {
            setLoadingPage(false);
            errorToast('Une erreur s\'est produite lors de la récupération des étudiants');
        }
    };

    const getGroups = async () => {
        try {
            const { data } = await axiosClient.get("validator/groups");
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
            ...observationsConseiller,
            [id]: observation
        };
        setObservationsConseiller(updatedObservations);

        try {
            await axiosClient.put(`validator/etudiants/${id}/updateObservationConseiller`, {
                observations_conseiller: observation
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
            headerName: 'Observation du Conseiller',
            flex: 3,
            renderCell: (params) => (
                <Select
                    value={observationsConseiller[params.row.id] || ''}
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
