import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import GuestHome from "./componets/Guest/GuestHome";
import AllDesigners from "./componets/admin/_designers/AllDesigners";

// Auth Components
import AdministrateurLogin from "./componets/Auth/admin/AdministrateurLogin";

//Layouts
import GuestIndex from "./layouts/Guest/GuestIndex";
import AdminIndex from "./layouts/admin/AdminIndex";
import AllSecteurs from "./componets/admin/secteurs/AllSecteurs";
import AllFilieres from "./componets/admin/filieres/AllFilieres";
import AllEtudiant from "./componets/admin/etudiants/AllEtudiant";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import DashboardAdmin from "./layouts/admin/dashboard";
import FormateurIndex from "./layouts/formateur/FormateurIndex";
import DashboardFormateur from "./layouts/formateur/dashboard";
import DashboardGestionnaire from "./layouts/gestionnaire/dashboard";
import FormateurLogin from "./componets/Auth/formateur/FormateurLogin";
import GestionnaireLogin from "./componets/Auth/gestionnaire/GestionnaireLogin";
import AbsencesByDaySeanceGroup from "./componets/gestionnaire/absences/AbsencesByDaySeanceGroup";
import AllGestionnaires from "./componets/admin/_validators/AllGestionnaire";
import GestionnaireIndex from "./layouts/gestionnaire/GestionnaireIndex";
import AlertDetails from "./componets/gestionnaire/alerts/AlertDetails";
import AllAlerts from "./componets/gestionnaire/alerts/AllAlerts";
import AllAdminAlerts from "./componets/admin/alerts/AllAdminAlerts";
import AlertAdminDetails from "./componets/admin/alerts/AlertAdminDetails";
import EtudiantListAdministrateur from "./componets/admin/absences/EtudiantListAdministrateur";
import AbsencesByDaySeanceGroupAdmin from "./componets/admin/absences_historique/AbsencesByDaySeanceGroupAdmin";
import RendezVousGestionnaire from "./componets/gestionnaire/rendez_vous/RendezVousGestionnaire";
import RendezVousAdmin from "./componets/admin/rendez_vous/RendezVousAdmin";
import AllGroups from "./componets/admin/groups/AllGroups";
import EtudiantDetails from "./componets/admin/etudiants/EtudiantDetails";
import AbsencesListFormateur from "./componets/formateur/absences/AbsencesListFormateur";
import EtudiantListFormateur from "./componets/formateur/etudiants/EtudiantListFormateur";
import EtudiantListGestionnaire from "./componets/gestionnaire/absences/EtudiantListGestionnaire";
import EtudiantListReview from "./componets/gestionnaire/etudiants/EtudiantListReview";
import JustifyAbsence from "./componets/admin/etudiants/JustifyAbsence";
import Home from "./componets/acces/page";

function App() {
  const [theme, colorMode] = useMode();

  return (
    <>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<GuestIndex />}>
            <Route path="acces"  element={<Home />} />
               
              <Route index element={<GuestHome />} />
              <Route path="formateur/login" element={<FormateurLogin />} />
              <Route path="gestionnaire/login" element={<GestionnaireLogin />} />
              <Route path="administrateur/login" element={<AdministrateurLogin />} />
            </Route>
            <Route path="/administrateur" element={<AdminIndex />}>
              <Route
                index
                element={<DashboardAdmin />}
              />
              <Route path="etudiants" element={<AllEtudiant />} />
              <Route path="etudiant/:id" element={<EtudiantDetails />} />
              <Route path="gestionnaires" element={<AllGestionnaires />} />
              <Route path="designers" element={<AllDesigners />} />
              <Route path="secteurs" element={<AllSecteurs />} />
              <Route path="filieres" element={<AllFilieres />} />
              <Route path="groupes" element={<AllGroups />} />
              <Route path="alerts" element={<AllAdminAlerts />} />
              <Route path="alert/:id" element={<AlertAdminDetails />} />
              <Route path="absences" element={<EtudiantListAdministrateur />} />
              <Route path="absence/:id" element={<JustifyAbsence />} />
              <Route path="absences_historiques" element={<AbsencesByDaySeanceGroupAdmin />} />
              <Route path="rendez_vous" element={<RendezVousAdmin />} />
            </Route>
            <Route path="/concepteur" element={<FormateurIndex />}>
              <Route
                index
                element={<DashboardFormateur />}
              />
              <Route path="etudiants" element={<EtudiantListFormateur />} />
              <Route path="absences" element={<AbsencesListFormateur />} />
              <Route path="team" element={<Team />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="form" element={<Form />} />
              <Route path="bar" element={<Bar />} />
              <Route path="pie" element={<Pie />} />
              <Route path="line" element={<Line />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="geography" element={<Geography />} />
            </Route>

            <Route path="/gestionnaire" element={<GestionnaireIndex />}>
              <Route
                index
                element={<DashboardGestionnaire />}
              />
              <Route path="absences" element={<EtudiantListGestionnaire />} />
              <Route path="absences_historiques" element={<AbsencesByDaySeanceGroup />} />
              <Route path="alerts" element={<AllAlerts />} />
              <Route path="alert/:id" element={<AlertDetails />} />
              <Route path="rendez_vous" element={<RendezVousGestionnaire />} />
              <Route path="etudiants" element={<EtudiantListReview />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          {/* 
          <div className="app">
          <Sidebar isSidebar={isSidebar} />
            <main className="content">
              <Topbar setIsSidebar={setIsSidebar} />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/team" element={<Team />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/form" element={<Form />} />
                <Route path="/bar" element={<Bar />} />
                <Route path="/pie" element={<Pie />} />
                <Route path="/line" element={<Line />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/geography" element={<Geography />} />
              </Routes>
            </main>
          </div>
            */}
        </ThemeProvider>

      </ColorModeContext.Provider>
    </>
  );
}

export default App;
