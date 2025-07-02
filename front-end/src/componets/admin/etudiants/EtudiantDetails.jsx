import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CircularProgress, Typography, Box, Grid, Card, CardContent, CardHeader, Divider, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { axiosClient } from '../../../config/Api/AxiosClient';
import { errorToast, successToast } from '../../../config/Toasts/toasts';

function EtudiantDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [etudiant, setEtudiant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totalDureeAbsences, setTotalDureeAbsences] = useState(0);

    useEffect(() => {
        const fetchEtudiantData = async () => {
            try {
                const { data } = await axiosClient.get(`admin/getEtudiantData/${id}`);
                setEtudiant(data.etudiant);
                setTotalDureeAbsences(data.total_duree_absences);
            } catch (error) {
                errorToast('Une erreur s\'est produite lors de la récupération des données de l\'étudiant');
            } finally {
                setLoading(false);
            }
        };

        fetchEtudiantData();
    }, [id]);

    const handleSendAlert = async () => {
        try {
            await axiosClient.post('admin/sendAlert', {
                etudiant_id: id,
                total_absences: totalDureeAbsences
            });
            successToast('Alerte envoyée avec succès');
        } catch (error) {
            errorToast('Une erreur s\'est produite lors de l\'envoi de l\'alerte');
        }
    };

    const handleJustifyAbsence = (absenceId) => {
        navigate(`/administrateur/absence/${absenceId}`);
    };

    const handleDownloadCertificat = async (filePath) => {
        try {
            const response = await axiosClient.post('/admin/download-certificat', { filePath }, {
                responseType: 'blob',
            });
    
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filePath.split('/').pop()); // Extract the file name
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading the file', error);
        }
    };

    const absenceColumns = [
        { field: 'id', headerName: 'ID de l\'Absence', flex: 1 },
        { field: 'date', headerName: 'Date', flex: 1 },
        { field: 'duree', headerName: 'Durée', flex: 1 },
        { field: 'commentaire', headerName: 'Commentaire', flex: 2 },
        { field: 'statut', headerName: 'Statut', flex: 1 },
        { field: 'is_justified', headerName: 'Justifiée', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 2,
            renderCell: (params) => (
                <>
                    {!params.row.is_justified ? (
                        <Button
                            variant="outlined"
                            onClick={() => handleJustifyAbsence(params.row.id)}
                        >
                            Justifier maintenant
                        </Button>
                    ) : (
                        <Button
                            variant="outlined"
                            onClick={() => handleDownloadCertificat(params.row.certificat)}
                        >
                            Télécharger certificat
                        </Button>
                    )}
                </>
            ),
        },
    ];

    const alertColumns = [
        { field: 'id', headerName: 'ID de l\'Alerte', flex: 1 },
        { field: 'duree', headerName: 'Durée', flex: 1 },
        { field: 'commentaire', headerName: 'Commentaire', flex: 2 },
        { field: 'is_validated', headerName: 'Validée', flex: 1 },
    ];

    if (loading) {
        return <CircularProgress />;
    }

    if (!etudiant) {
        return <Typography>Aucune donnée étudiante trouvée</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Détails de l&apos;étudiant</Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardHeader title="Informations Générales" />
                        <Divider />
                        <CardContent>
                            <Typography variant="h6">CIN: {etudiant.cin}</Typography>
                            <Typography variant="h6">Nom: {etudiant.nom} {etudiant.prenom}</Typography>
                            <Typography variant="h6">Email: {etudiant.email}</Typography>
                            <Typography variant="h6">Numéro de Stagiaire: {etudiant.numero_stagiaire}</Typography>
                            <Typography variant="h6">Numéro de Parent: {etudiant.numero_parent}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardHeader title="Informations Académiques" />
                        <Divider />
                        <CardContent>
                            <Typography variant="h6">Groupe: {etudiant.group.nom}</Typography>
                            <Typography variant="h6">Filière: {etudiant.group.filiere.nom}</Typography>
                            <Typography variant="h6">Durée Totale des Absences: {totalDureeAbsences} heures</Typography>
                            {totalDureeAbsences > 5 && (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleSendAlert}
                                    sx={{ mt: 2 }}
                                >
                                    Envoyer une alerte
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                
            </Grid>
        </Box>
    );
}

export default EtudiantDetails;
