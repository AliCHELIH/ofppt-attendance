import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  Grid,
  LinearProgress,
  Skeleton,
  styled,
  Paper,
  Button
} from "@mui/material";
import Header from "../../../components/Header";
import { axiosClient } from "../../../config/Api/AxiosClient";
import {
  Group,
  EventAvailable,
  PersonOff,
  RunningWithErrors,
  DownloadOutlined
} from "@mui/icons-material";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Placeholder for your OFPPT Logo Base64 string (SAME AS ADMIN)
// IMPORTANT: Replace this with your actual Base64 logo string
const ofpptLogoBase64 = "YOUR_BASE64_LOGO_STRING_HERE";

// Composant de carte de statistiques stylée
const StatCard = styled(Paper)(({ theme }) => ({
  borderRadius: '12px',
  padding: theme.spacing(3),
  textAlign: 'center',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[10]
  },
  // Base styles for animation
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

const DashboardFormateur = () => {
  const theme = useTheme();
  const [stats, setStats] = useState({
    myStudents: 0,
    sessionsToday: 0,
    absencesToday: 0,
    delaysToday: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const getColor = (colorName) => {
    return theme.palette[colorName]?.main || theme.palette.primary.main;
  };

  // !! IMPORTANT !! Verify these endpoints and stat meanings with your backend API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [studentsRes, sessionsRes, absencesRes, delaysRes] = await Promise.all([
          axiosClient.get("/formateur/my-students/count"),
          axiosClient.get("/formateur/sessions/today/count"),
          axiosClient.get("/formateur/absences/today/count"),
          axiosClient.get("/formateur/delays/today/count"),
        ]);

        // !! IMPORTANT !! Update this mapping based on actual API responses
        setStats({
          myStudents: studentsRes.data.count || 0,
          sessionsToday: sessionsRes.data.count || 0,
          absencesToday: absencesRes.data.count || 0,
          delaysToday: delaysRes.data.count || 0,
        });
      } catch (error) {
        console.error("Error fetching formateur dashboard data", error);
        setStats({ myStudents: 12, sessionsToday: 2, absencesToday: 5, delaysToday: 0 });
      } finally {
        setLoading(false);
        setTimeout(() => setIsVisible(true), 100);
      }
    };

    fetchData();
  }, []);

  // --- PDF Generation for Formateur ---
  const generatePDFReport = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    const margin = 15;

    const primaryColor = '#0056b3'; // Adjust as needed
    const secondaryColor = '#6c757d';
    const headerBgColor = '#f8f9fa';
    const tableHeaderBg = primaryColor;
    const tableHeaderColor = '#FFFFFF';

    // -- Header --
    doc.setFillColor(headerBgColor);
    doc.rect(0, 0, pageWidth, 30, 'F');
    if (ofpptLogoBase64.startsWith("data:image")) {
        try {
            const imgProps = doc.getImageProperties(ofpptLogoBase64);
            const imgHeight = 15;
            const imgWidth = (imgProps.width * imgHeight) / imgProps.height;
            doc.addImage(ofpptLogoBase64, 'PNG', margin, 7.5, imgWidth, imgHeight);
        } catch (e) { /* Handle error silently or log */ }
    } else {
       doc.setFontSize(8); doc.setTextColor(150); doc.text("OFPPT Logo", margin, 15);
    }
    doc.setFont('helvetica', 'bold'); doc.setFontSize(16); doc.setTextColor(primaryColor);
    doc.text('Rapport Formateur - Statistiques du Jour', pageWidth / 2, 15, { align: 'center' });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(secondaryColor);
    doc.text('ISTA TIZNIT', pageWidth / 2, 22, { align: 'center' }); // Simplified subtitle

    // -- Metadata --
    const generationDate = new Date();
    doc.setFontSize(9); doc.setTextColor(secondaryColor);
    doc.text(`Généré le: ${generationDate.toLocaleDateString()} à ${generationDate.toLocaleTimeString()}`, margin, 40);

    // -- Content Separator --
    doc.setDrawColor(primaryColor); doc.setLineWidth(0.5);
    doc.line(margin, 45, pageWidth - margin, 45);

    // -- Table --
    // !! IMPORTANT !! Use the correct titles reflecting the actual fetched data
    const tableData = [
      { title: 'Nombre total de mes stagiaires', value: stats.myStudents },
      { title: "Nombre de séances aujourd'hui", value: stats.sessionsToday },
      { title: "Absences aujourd'hui (toutes séances)", value: stats.absencesToday },
      { title: "Retards aujourd'hui (toutes séances)", value: stats.delaysToday },
    ];

    autoTable(doc, {
      startY: 55,
      head: [['Indicateur', 'Valeur']],
      body: tableData.map(item => [item.title, item.value]),
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3, valign: 'middle' },
      headStyles: { fillColor: tableHeaderBg, textColor: tableHeaderColor, fontStyle: 'bold', halign: 'center' },
      columnStyles: {
        0: { cellWidth: 'auto', fontStyle: 'bold' },
        1: { halign: 'center', cellWidth: 40 }
      },
      margin: { left: margin, right: margin },
      didDrawPage: (data) => {
        // -- Footer --
        doc.setFontSize(8); doc.setTextColor(secondaryColor);
        doc.setLineWidth(0.1); doc.setDrawColor(secondaryColor);
        doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
        doc.text('Rapport généré par le Système de Gestion de Présence - OFPPT', margin, pageHeight - 10);
        doc.text(`Page ${data.pageNumber}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
      }
    });

    let finalY = (doc).lastAutoTable.finalY || 70;
    doc.setFontSize(10); doc.setTextColor(secondaryColor);
    doc.text("Ce rapport résume les statistiques clés pour vos activités.", margin, finalY + 10);

    doc.save(`Rapport_Formateur_${generationDate.toISOString().slice(0, 10)}.pdf`);
  };
  // --- End PDF Generation ---

  const getAnimationStyle = (index) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 0.5s ease-out ${index * 0.1}s, transform 0.5s ease-out ${index * 0.1}s`,
  });

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* --- Header Section with Export Button --- */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Header
          title="TABLEAU DE BORD FORMATEUR"
          subtitle="Vue d'ensemble de vos activités"
        />
         
      </Box>

      {/* --- Statistics Grid --- */}
      <Grid container spacing={4}>
        {[
          // !! IMPORTANT !! Update titles/icons if stat meanings change
          { key: 'myStudents', icon: <Group sx={{ fontSize: 32 }} />, title: "Mes Stagiaires", value: stats.myStudents, colorKey: 'primary' },
          { key: 'sessionsToday', icon: <EventAvailable sx={{ fontSize: 32 }} />, title: "Séances Aujourd'hui", value: stats.sessionsToday, colorKey: 'success' },
          { key: 'absencesToday', icon: <PersonOff sx={{ fontSize: 32 }} />, title: "Absences Aujourd'hui", value: stats.absencesToday, colorKey: 'error' },
          { key: 'delaysToday', icon: <RunningWithErrors sx={{ fontSize: 32 }} />, title: "Retards Aujourd'hui", value: stats.delaysToday, colorKey: 'warning' },
        ].map((stat, index) => {
          const color = getColor(stat.colorKey);
          // Adjust progress calculation if needed
          const maxProgressValue = stat.key === 'myStudents' ? Math.max(stats.myStudents, 1) : 50;
          const progressValue = Math.min((stat.value / maxProgressValue) * 100, 100);

          return (
            <Grid item xs={12} sm={6} lg={3} key={stat.key}>
              <StatCard elevation={2} sx={getAnimationStyle(index)}>
                {loading ? (
                   <>
                    <Skeleton variant="circular" width={theme.spacing(8)} height={theme.spacing(8)} sx={{ margin: '0 auto', mb: 2 }} />
                    <Skeleton variant="text" sx={{ mb: 1, fontSize: '1.25rem', width: '70%', margin: '0 auto' }} />
                    <Skeleton variant="text" sx={{ fontSize: '2rem', width: '40%', margin: '0 auto', mb: 2 }}/>
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

      {/* --- Optional Last Update Box --- */}
      {!loading && (
        <Box sx={{ mt: 6, p: 2, borderRadius: 2, backgroundColor: theme.palette.background.paper, textAlign: 'center', boxShadow: theme.shadows[1] }}>
          <Typography variant="caption" color="text.secondary">
            Dernière mise à jour des données: {new Date().toLocaleTimeString()}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DashboardFormateur;
