import { Link } from 'react-router-dom';
import { useAppContext } from '../../../config/context/ComponentContext';
import { Card, CardContent, Typography, Box, Icon } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CheckIcon from '@mui/icons-material/Check';

function AllAlerts() {
    const { alerts } = useAppContext();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>
            {alerts?.map(alert => (
                <Card
                    key={alert.id}
                    sx={{
                        textDecoration: 'none',
                        // backgroundColor: alert?.is_validated ? 'lightgreen' : 'lightcoral',
                        // border: '1px solid',
                        // borderColor: alert?.is_validated ? 'green' : 'red',
                        '&:hover': {
                            boxShadow: 6,
                        }
                    }}
                    component={Link}
                    to={`/gestionnaire/alert/${alert.id}`}
                >
                    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ mr: 2 }}>
                        {!alert?.is_validated ?
                            <Icon fontSize='large'>
                                <WarningIcon color="error" />
                            </Icon>
                            : <Icon fontSize='large'>
                                <CheckIcon color="success" />
                            </Icon>}
                        </Box>
                        <Box>
                            <Typography variant="h6" component="div">
                                {alert.etudiant.nom} {alert.etudiant.prenom}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {alert.commentaire}
                            </Typography>
                            <Typography variant="caption" display="block" gutterBottom>
                                Duration: {alert.duree} hours
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}

export default AllAlerts;
