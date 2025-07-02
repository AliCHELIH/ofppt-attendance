import { Link, useParams } from 'react-router-dom';
import { useAppContext } from '../../../config/context/ComponentContext';
import { useEffect, useState } from 'react';
import { Divider, Typography, Box, Button, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar, Grid } from '@mui/material';
import { Check, Cancel } from '@mui/icons-material';

const AlertDetails = () => {
    const { id } = useParams();
    const { alerts } = useAppContext();
    const [alert, setAlert] = useState({});
    const [etudiant, setEtudiant] = useState({});

    useEffect(() => {
        setEtudiant(alert?.etudiant);
    }, [alert, alerts]);

    useEffect(() => {
        setAlert(alerts?.find(alert => alert.id === +id));
    }, [alerts, id]);

    return (
        <Box sx={{ p: 4, margin: 'auto', maxWidth: 800 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Alert
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1"><strong>Commentaire:</strong> {alert?.commentaire}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Typography variant="body1"><strong>Duree:</strong> {alert?.duree}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="body1"><strong>Motif d&apos;accompagnement:</strong> {alert?.motif_d_accompagnement}</Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h4" gutterBottom>
                    Etudiant
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            {etudiant?.nom} {etudiant?.prenom}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1"><strong>CIN:</strong> {etudiant?.cin}</Typography>
                        <Typography variant="body1"><strong>Numéro Stagiaire:</strong> {etudiant?.numero_stagiaire}</Typography>
                        <Typography variant="body1"><strong>Numéro Parent:</strong> {etudiant?.numero_parent}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1"><strong>Filière:</strong> {etudiant?.group?.filiere?.nom}</Typography>
                        <Typography variant="body1"><strong>Groupe:</strong> {etudiant?.group?.nom}</Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 3 }} />
                {etudiant?.absences?.length > 0 && (
                    <>
                        <Typography variant="h5" gutterBottom>
                            Absences
                        </Typography>
                        <List>
                            {etudiant?.absences?.map(absence => (
                                <ListItem key={absence?.id} alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar>{absence?.seance?.charAt(0)}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={`Séance: ${absence?.seance === 's1' ? '8:00 - 11:00' : (absence?.seance === 's2' ? '11:00 - 13:30' : (absence?.seance === 's3' ? '13:30 - 16:00' : '16:00 - 18:30'))}`}
                                        secondary={
                                            <>
                                                <Typography component="span" variant="body2" color="text.primary">
                                                    {absence?.date}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Absence réalisée par {absence?.designer || absence?.validator ?
                                                        (absence?.designer ? 'formateur: ' + absence?.designer?.first_name + ' ' + absence?.designer?.last_name : 'gestionnaire: ' + absence?.validator?.first_name + ' ' + absence?.validator?.last_name)
                                                        : 'administrateur'
                                                    }
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </>
                )}
                {alert?.is_validated ? (
                    <Button variant="contained" color="secondary" disabled>
                        Problème déjà résolu
                    </Button>
                ) : (
                    // <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    //     <Button variant="contained" color="error" startIcon={<Cancel />}>
                    //         Annuler
                    //     </Button>
                    //     <Button variant="contained" color="primary" startIcon={<Check />}>
                    //         Valider
                    //     </Button>
                    // </Box>
                    <Button variant="contained" color="primary" startIcon={<Check />}>
                        <Link to="/gestionnaire/rendez_vous" style={{ textDecoration: 'none', color: 'white' }}>
                            Planifier un rendez-vous
                        </Link>
                    </Button>
                )}
            </Paper>
        </Box>
    );
};

export default AlertDetails;
