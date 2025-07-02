import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
    Box,
    Button,
    useTheme,
    Typography,
    Grid,
    Paper,
    styled,
    Skeleton
} from '@mui/material';
import Header from '../../../components/Header';
import { axiosClient } from '../../../config/Api/AxiosClient';
import {
  People as PeopleIcon,
  EventAvailable as EventAvailableIcon,
  PersonOff as PersonOffIcon,
  WarningAmber as WarningIcon,
  DownloadOutlined as DownloadOutlinedIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import AbsencesByDaySeanceGroup from '../../../componets/gestionnaire/absences/AbsencesByDaySeanceGroup';

const ofpptLogoBase64 = "YOUR_BASE64_LOGO_STRING_HERE";

const StatCard = styled(Paper)(({ theme }) => ({
  borderRadius: '12px',
  padding: theme.spacing(3),
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[10]
  },
  opacity: 0,
  transform: 'translateY(20px)',
}));

const IconWrapper = styled(Box)(({ theme, bgcolor }) => ({
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  width: theme.spacing(8),
  height: theme.spacing(8),
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: bgcolor || theme.palette.primary.main,
  color: theme.palette.common.white,
  flexShrink: 0,
  boxShadow: `0 4px 8px 0 ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.1)'}`,
}));

const DashboardGestionnaire = () => {
  const theme = useTheme();

  const [stats, setStats] = useState({
    etudiantsCount: 8,
    rendezvousCount: 4,
    absencesNJCount: 0,
    activeAlertsCount: 3,
  });
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [etudiantsRes, rendezvousRes, absencesRes, alertsRes] = await Promise.all([
          axiosClient.get('/validator/etudiants/count'),
          axiosClient.get('/validator/appointments/count'),
          axiosClient.get('/validator/absences/count?status=Absent&is_justified=0'),
          axiosClient.get('/validator/alerts/count?is_validated=0')
        ]);

        setStats({
          etudiantsCount: etudiantsRes.data.count || 8,
          rendezvousCount: rendezvousRes.data.count || 4,
          absencesNJCount: absencesRes.data.count || 0,
          activeAlertsCount: alertsRes.data.count || 3
        });

      } catch (error) {
        console.error('Erreur lors de la récupération des données du tableau de bord:', error);
        setStats({ etudiantsCount: 8, rendezvousCount: 4, absencesNJCount: 0, activeAlertsCount: 3 });
      } finally {
        setLoading(false);
        setTimeout(() => setIsVisible(true), 100);
      }
    };

    fetchDashboardData();
  }, []);

  const generatePDFReport = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    const margin = 15;

    const primaryColor = '#0056b3'; const secondaryColor = '#6c757d';
    const headerBgColor = '#f8f9fa'; const tableHeaderBg = primaryColor;
    const tableHeaderColor = '#FFFFFF';

    doc.setFillColor(headerBgColor); doc.rect(0, 0, pageWidth, 30, 'F');
    if (ofpptLogoBase64.startsWith("data:image")) {
        try {
            const imgProps = doc.getImageProperties(ofpptLogoBase64);
            const imgHeight = 15; const imgWidth = (imgProps.width * imgHeight) / imgProps.height;
            doc.addImage(ofpptLogoBase64, 'PNG', margin, 7.5, imgWidth, imgHeight);
        } catch (e) { console.error("PDF Logo Error:", e); }
    } else { doc.setFontSize(8); doc.setTextColor(150); doc.text("OFPPT Logo", margin, 15); }
    doc.setFont('helvetica', 'bold'); doc.setFontSize(16); doc.setTextColor(primaryColor);
    doc.text('Rapport de Synthèse - Gestionnaire', pageWidth / 2, 15, { align: 'center' });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(secondaryColor);
    doc.text('ISTA TIZNIT', pageWidth / 2, 22, { align: 'center' });

    const generationDate = new Date();
    doc.setFontSize(9); doc.setTextColor(secondaryColor);
    doc.text(`Généré le: ${generationDate.toLocaleDateString()} à ${generationDate.toLocaleTimeString()}`, margin, 40);
    doc.setDrawColor(primaryColor); doc.setLineWidth(0.5);
    doc.line(margin, 45, pageWidth - margin, 45);

    const tableData = [
      { title: 'Nombre total de stagiaires', value: stats.etudiantsCount },
      { title: 'Nombre total de rendez-vous', value: stats.rendezvousCount },
      { title: 'Absences non justifiées (Total)', value: stats.absencesNJCount },
      { title: 'Alertes actives (Non validées)', value: stats.activeAlertsCount }
    ];

    autoTable(doc, {
      startY: 55,
      head: [['Indicateur Clé', 'Valeur']],
      body: tableData.map(item => [item.title, item.value]),
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3, valign: 'middle' },
      headStyles: { fillColor: tableHeaderBg, textColor: tableHeaderColor, fontStyle: 'bold', halign: 'center' },
      columnStyles: { 0: { cellWidth: 'auto', fontStyle: 'bold' }, 1: { halign: 'center', cellWidth: 40 } },
      margin: { left: margin, right: margin },
      didDrawPage: (data) => {
        doc.setFontSize(8); doc.setTextColor(secondaryColor);
        doc.setLineWidth(0.1); doc.setDrawColor(secondaryColor);
        doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
        doc.text('Rapport généré par le Système de Gestion de Présence - OFPPT', margin, pageHeight - 10);
        doc.text(`Page ${data.pageNumber}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
      }
    });

    let finalY = (doc).lastAutoTable.finalY || 70;
    doc.setFontSize(10); doc.setTextColor(secondaryColor);
    doc.text("Ce rapport présente un aperçu global des données du système.", margin, finalY + 10);

    doc.save(`Rapport_Gestionnaire_${generationDate.toISOString().slice(0, 10)}.pdf`);
  };

  const getAnimationStyle = (index) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 0.5s ease-out ${index * 0.1}s, transform 0.5s ease-out ${index * 0.1}s`,
  });

  const getColor = (colorName) => {
    return theme.palette[colorName]?.main || theme.palette.primary.main;
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Header 
          title="TABLEAU DE BORD GESTIONNAIRE" 
          subtitle="Aperçu des indicateurs clés"
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadOutlinedIcon />}
          onClick={generatePDFReport}
          disabled={loading || !ofpptLogoBase64.startsWith("data:image")}
          title={!ofpptLogoBase64.startsWith("data:image") ? "Logo manquant pour l'export PDF" : "Exporter le rapport"}
          sx={{
             px: 3, py: 1.2, borderRadius: '8px', fontWeight: 600, textTransform: 'none',
             boxShadow: theme.shadows[2], '&:hover': { boxShadow: theme.shadows[4], backgroundColor: theme.palette.primary.dark }
          }}
        >
          Exporter PDF
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={2}
            sx={{ 
              p: 3,
              borderRadius: 3,
              background: theme.palette.background.paper,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: theme.shadows[4]
              }
            }}
          >
            <Box sx={{ 
              width: 60,
              height: 60,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: theme.palette.primary.main,
              color: 'white'
            }}>
              <PeopleIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
              {stats.etudiantsCount}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Total Stagiaires
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            elevation={2}
            sx={{ 
              p: 3,
              borderRadius: 3,
              background: theme.palette.background.paper,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: theme.shadows[4]
              }
            }}
          >
            <Box sx={{ 
              width: 60,
              height: 60,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: theme.palette.info.main,
              color: 'white'
            }}>
              <EventAvailableIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.info.main }}>
              {stats.rendezvousCount}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Total Rendez-vous
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            elevation={2}
            sx={{ 
              p: 3,
              borderRadius: 3,
              background: theme.palette.background.paper,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: theme.shadows[4]
              }
            }}
          >
            <Box sx={{ 
              width: 60,
              height: 60,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: theme.palette.warning.main,
              color: 'white'
            }}>
              <WarningIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.warning.main }}>
              {stats.activeAlertsCount}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Total Alertes
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {!loading && (
        <Box sx={{ mt: 6, p: 2, borderRadius: 2, backgroundColor: theme.palette.background.paper, textAlign: 'center', boxShadow: theme.shadows[1] }}>
          <Typography variant="caption" color="text.secondary">
            Dernière mise à jour des données: {new Date().toLocaleTimeString()}
          </Typography>
        </Box>
      )}

      {/* Absences Historiques Section */}
      <Box sx={{ mt: 6 }}>
        <Paper 
          elevation={3}
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            mb: 3
          }}
        >
          <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <HistoryIcon sx={{ fontSize: 32, color: 'white' }} />
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
              Historique des Absences
            </Typography>
          </Box>
        </Paper>

        <Paper 
          elevation={2}
          sx={{ 
            p: 3,
            borderRadius: 3,
            background: theme.palette.background.paper,
            '& .MuiDataGrid-root': {
              border: 'none',
              '& .MuiDataGrid-cell': {
                borderBottom: `1px solid ${theme.palette.divider}`,
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText,
                borderBottom: 'none',
              },
            },
            '& .MuiButton-root': {
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: theme.shadows[2],
              '&:hover': {
                boxShadow: theme.shadows[4],
              },
            },
            '& .MuiSelect-select': {
              borderRadius: 2,
            },
            '& .MuiTextField-root': {
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            },
          }}
        >
          <AbsencesByDaySeanceGroup />
        </Paper>
      </Box>
    </Box>
  );
};

export default DashboardGestionnaire;