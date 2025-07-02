import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CircularProgress, Typography, Box, Paper, TextField, Button, FormHelperText } from '@mui/material';
import { axiosClient } from '../../../config/Api/AxiosClient';
import { errorToast, successToast } from '../../../config/Toasts/toasts';

function JustifyAbsence() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [absence, setAbsence] = useState(null);
    const [loading, setLoading] = useState(true);
    const [commentaire, setCommentaire] = useState('');
    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchAbsenceData = async () => {
            try {
                const { data } = await axiosClient.get(`admin/absences/${id}`);
                setAbsence(data.absence);
                setCommentaire(data.absence.commentaire || '');
            } catch (error) {
                errorToast('Une erreur s\'est produite lors de la récupération des données de l\'absence');
            } finally {
                setLoading(false);
            }
        };

        fetchAbsenceData();
    }, [id]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('certificat', file);
        formData.append('commentaire', commentaire);

        try {
            await axiosClient.post(`admin/justifyAbsence/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            successToast('Absence justifiée avec succès');
            navigate(-1);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                errorToast('Une erreur s\'est produite lors de la justification de l\'absence');
            }
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (!absence) {
        return <Typography>Aucune donnée d&apos;absence trouvée</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Justifier l&apos;absence</Typography>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6">ID de l&apos;Absence: {absence.id}</Typography>
                <Typography variant="h6">Date: {absence.date}</Typography>
                <Typography variant="h6">Durée: {absence.duree}</Typography>
                <Typography variant="h6">Seance: {absence.seance}</Typography>
                <Typography variant="h6">Statut: {absence.statut}</Typography>
                <Typography variant="h6">Justifiée: {absence.is_justified ? 'Oui' : 'Non'}</Typography>
                <Box mt={2}>
                    <TextField
                        fullWidth
                        label="Commentaire"
                        value={commentaire}
                        onChange={(e) => setCommentaire(e.target.value)}
                        multiline
                        rows={4}
                        error={!!errors.commentaire}
                        helperText={errors.commentaire ? errors.commentaire[0] : ''}
                    />
                    <Button
                        variant="contained"
                        component="label"
                        sx={{ mt: 2 }}
                    >
                        Upload Certificat
                        <input
                            type="file"
                            hidden
                            onChange={handleFileChange}
                        />
                    </Button>
                    {errors.certificat && <FormHelperText error>{errors.certificat[0]}</FormHelperText>}
                </Box>
                <Box mt={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        Justifier
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}

export default JustifyAbsence;
