import { Avatar, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { axiosClient } from "../../../config/Api/AxiosClient";
import { useAppContext } from "../../../config/context/ComponentContext";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { errorToast, successToast } from "../../../config/Toasts/toasts";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import WarningIcon from '@mui/icons-material/Warning';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CheckIcon from '@mui/icons-material/Check';

const TopbarAdmin = () => {
  const [logoutLoading, setLogoutLoading] = useState(false);
  const { navigateTo, alerts } = useAppContext();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const open = Boolean(anchorEl);
  const openProfile = Boolean(anchorElProfile);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRouteAlert = (id) => {
    navigateTo(`/administrateur/alert/${id}`)
    handleClose();
  }

  const handleRouteAllAlerts = () => {
    navigateTo(`/administrateur/alerts`)
  }
  const handleClickProfile = (event) => {
    setAnchorElProfile(event.currentTarget);
  };
  const handleCloseProfile = () => {
    setAnchorElProfile(null);
  };


  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await axiosClient.post("admin/logout");
      localStorage.removeItem("ud");
      navigateTo("/");
      successToast("Vous avez été deconnecté avec succès");
    } catch (error) {
      console.error(error);
      errorToast("Une erreur est survenue");
    } finally {
      setLogoutLoading(false);
    }
  }

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton
          onClick={handleClick}
          size="small"
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <NotificationsOutlinedIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {alerts?.length > 0 ? alerts?.map((alert, index) => {
            if (index < 5) {
              return (
                <MenuItem key={alert?.id} onClick={() => handleRouteAlert(alert?.id)} sx={{ p: 1 }}>
                  {alert?.is_validated ? <CheckIcon sx={{ mr: 1 }} color="success" /> : <WarningIcon color="error" sx={{ mr: 1 }} />}
                  {alert?.etudiant?.nom} {alert?.etudiant?.prenom} {alert?.commentaire}
                </MenuItem>
              )
            }
            if (index === 5) {
              return (
                <MenuItem key={alert?.id} onClick={() => handleRouteAllAlerts()} sx={{ p: 1 }}>
                  Afficher toutes les alertes
                </MenuItem>
              )
            }
            if (index >= 5) {
              return null;
            }
          }) : <MenuItem>
            <DoneAllIcon sx={{ mr: 1 }} />
            Aucune alertes !
          </MenuItem>}
        </Menu>
        <IconButton
          onClick={handleClickProfile}
          size="small"
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          {logoutLoading ? <AutorenewIcon /> : <PersonOutlinedIcon />}
        </IconButton>
        <Menu
          anchorEl={anchorElProfile}
          id="account-menu"
          open={openProfile}
          onClose={handleCloseProfile}
          onClick={handleCloseProfile}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleCloseProfile}>
            <Avatar /> Profile
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleCloseProfile}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Paramétres
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Déconnexion
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default TopbarAdmin;
