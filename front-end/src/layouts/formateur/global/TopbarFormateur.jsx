import { Box, IconButton, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { axiosClient } from "../../../config/Api/AxiosClient";
import { useAppContext } from "../../../config/context/ComponentContext";
import { errorToast, successToast } from "../../../config/Toasts/toasts";
import { Avatar, Divider, ListItemIcon, Menu, MenuItem } from "@mui/material";
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

const TopbarFormateur = () => {
  const [logoutLoading, setLogoutLoading] = useState(false);
  const { navigateTo } = useAppContext();

  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const openProfile = Boolean(anchorElProfile);

  const handleClickProfile = (event) => {
    setAnchorElProfile(event.currentTarget);
  };
  const handleCloseProfile = () => {
    setAnchorElProfile(null);
  };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await axiosClient.post("designer/logout");
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
          onClick={handleClickProfile}
          size="small"
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <PersonOutlinedIcon />
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

export default TopbarFormateur;
