import { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  useTheme, 
  Grid, 
  LinearProgress,
  Skeleton, 
  styled,
  Button,
  Paper
} from "@mui/material";
import Header from "../../../components/Header";
import { axiosClient } from "../../../config/Api/AxiosClient";
import { 
  PeopleAlt, 
  School, 
  Warning, 
  Schedule,
  DownloadOutlined
} from "@mui/icons-material";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const StatCard = styled(Paper)(({ theme }) => ({
  borderRadius: '12px',
  padding: theme.spacing(3),
  textAlign: 'center',
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
  boxShadow: `0 4px 8px 0 ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.1)'}`,
}));

const DashboardAdmin = () => {
  const theme = useTheme();
  const [stats, setStats] = useState({
    students: 0,
    absences: 0,
    alerts: 0,
    formateurs: 0
  });
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const getColor = (colorName) => {
    return theme.palette[colorName]?.main || theme.palette.primary.main;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [studentsRes, absencesRes, alertsRes, designersRes] = await Promise.all([
          axiosClient.get('/dashboard/total-students'),
          axiosClient.get('/dashboard/total-absences'),
          axiosClient.get('/dashboard/total-alerts'),
          axiosClient.get('/dashboard/total-designers'),
        ]);

        setStats({
          students: studentsRes.data.total || 0,
          absences: absencesRes.data.total || 0,
          alerts: alertsRes.data.total || 0,
          formateurs: designersRes.data.total || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard data', error);
        setStats({ students: 0, absences: 0, alerts: 0, formateurs: 0 });
      } finally {
        setLoading(false);
        setTimeout(() => setIsVisible(true), 100);
      }
    };

    fetchData();
  }, []);

  const generatePDFReport = () => {
    const doc = new jsPDF();

    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text(' Rapport Administratif - OFPPT ISTA TIZNIT', 105, 20, { align: 'center' });

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(` Date: ${new Date().toLocaleDateString()}`, 14, 40);
    doc.text(` Heure: ${new Date().toLocaleTimeString()}`, 14, 46);

    doc.setDrawColor(230);
    doc.line(14, 52, 196, 52);

    autoTable(doc, {
      startY: 58,
      head: [[' Indicateur', 'Valeur']],
      body: [
        [' Nombre de stagiaires', stats.students],
        ['Nombre de formateurs', stats.formateurs],
        [' Absences non justifiées', stats.absences],
        [' Alertes actives', stats.alerts],
      ],
      styles: {
        halign: 'center',
        cellPadding: 6,
        fontSize: 12,
      },
      headStyles: {
        fillColor: [33, 150, 243],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 10, bottom: 10 },
    });

    doc.setFontSize(12);
    const baseY = doc.lastAutoTable.finalY + 20;
    const maxVal = Math.max(stats.students, stats.formateurs, stats.absences, stats.alerts, 1);
    const scale = 120 / maxVal;
    const colors = [
      { label: 'Stagiaires', value: stats.students, color: [33, 150, 243] },
      { label: 'Formateurs', value: stats.formateurs, color: [76, 175, 80] },
      { label: 'Absences', value: stats.absences, color: [244, 67, 54] },
      { label: 'Alertes', value: stats.alerts, color: [255, 193, 7] },
    ];

    colors.forEach((item, index) => {
      const y = baseY + index * 25;
      doc.setFillColor(...item.color);
      doc.rect(40, y, item.value * scale, 10, 'F');
      doc.setTextColor(80);
      doc.text(`${item.label}: ${item.value}`, 40, y - 2);
    });

    doc.setTextColor(150);
    doc.setFontSize(10);
    doc.text('Rapport généré automatiquement par le système de gestion OFPPT.', 105, 285, { align: 'center' });

    doc.save(`rapport-admin-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const getAnimationStyle = (index) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 0.5s ease-out ${index * 0.1}s, transform 0.5s ease-out ${index * 0.1}s`,
  });

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Header title="TABLEAU DE BORD" subtitle="Aperçu des indicateurs clés" />

        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadOutlined />}
          onClick={generatePDFReport}
          disabled={loading}
          sx={{
             px: 3,
             py: 1.2,
             borderRadius: '8px',
             fontWeight: 600,
             textTransform: 'none',
             boxShadow: theme.shadows[2],
             '&:hover': {
                boxShadow: theme.shadows[4],
                backgroundColor: theme.palette.primary.dark,
             }
          }}
        >
          Exporter PDF
        </Button>
      </Box>

      <Grid container spacing={4}>
        {[
          { key: 'students', icon: <School sx={{ fontSize: 32 }} />, title: "Stagiaires", value: stats.students, colorKey: 'primary' },
          { key: 'formateurs', icon: <PeopleAlt sx={{ fontSize: 32 }} />, title: "Formateurs", value: stats.formateurs, colorKey: 'success' },
          { key: 'absences', icon: <Schedule sx={{ fontSize: 32 }} />, title: "Absences (NJ)", value: stats.absences, colorKey: 'error' },
          { key: 'alerts', icon: <Warning sx={{ fontSize: 32 }} />, title: "Alertes", value: stats.alerts, colorKey: 'warning' },
        ].map((stat, index) => {
          const color = getColor(stat.colorKey);
          const progressValue = Math.min((stat.value / (stat.key === 'students' ? 1000 : 100)) * 100, 100);

          return (
            <Grid item xs={12} sm={6} lg={3} key={stat.key}>
              <StatCard elevation={2} sx={getAnimationStyle(index)}>
                {loading ? (
                  <>
                    <Skeleton variant="circular" width={theme.spacing(8)} height={theme.spacing(8)} sx={{ margin: '0 auto', mb: 2 }} />
                    <Skeleton variant="text" sx={{ mb: 1, fontSize: '1.25rem', width: '60%', margin: '0 auto' }} />
                    <Skeleton variant="text" sx={{ fontSize: '2rem', width: '30%', margin: '0 auto', mb: 2 }}/>
                    <Skeleton variant="rectangular" height={8} sx={{ borderRadius: 4 }}/>
                  </>
                ) : (
                  <>
                    <IconWrapper bgcolor={color}>
                      {stat.icon}
                    </IconWrapper>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 500, color: theme.palette.text.secondary, mb: 0.5 }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 2 }}>
                      {stat.value}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={progressValue}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: theme.palette.action.hover,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: color
                        }
                      }}
                    />
                  </>
                )}
              </StatCard>
            </Grid>
          );
        })}
      </Grid>

      {!loading && (
        <Box sx={{ mt: 6, p: 2, borderRadius: 2, backgroundColor: theme.palette.background.paper, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: theme.shadows[1] }}>
          <Typography variant="caption" color="text.secondary">
            Dernière mise à jour: {new Date().toLocaleTimeString()}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DashboardAdmin;
