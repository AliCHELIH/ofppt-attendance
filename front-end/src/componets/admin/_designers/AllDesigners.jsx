import { useEffect, useState } from "react";
import { axiosClient } from "../../../config/Api/AxiosClient";
import CreateDesigner from "../../models/CreateDesigner";
import UpdateDesigner from "../../models/UpdateDesigner";
import { useAppContext } from "../../../config/context/ComponentContext";
import { Box, Button, CircularProgress, Modal, Typography, IconButton, useTheme } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockResetIcon from '@mui/icons-material/LockReset';
import { errorToast, successToast } from "../../../config/Toasts/toasts";
import { tokens } from "../../../theme";

const AllDesigners = () => {
  const [designers, setDesigners] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const { setErrors } = useAppContext();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const getAllDesigners = async () => {
    try {
      const { data } = await axiosClient.get("admin/designers");
      setDesigners(data);
      setErrors(null);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteDesigner = async (designer) => {
    try {
      setDeleteLoading(true);
      await axiosClient.delete("admin/designers/" + designer?.id);
      setDeleteLoading(false);
      handleCloseConfirmDelete();
      successToast("Le formateur a bien été supprimé");
      await getAllDesigners();
    } catch (error) {
      setDeleteLoading(false);
      handleCloseConfirmDelete();
      errorToast("Une erreur est survenue");
    }
  };

  useEffect(() => {
    document.title = "Tous les formateurs - OFPPT";
    getAllDesigners();
  }, []);

  const handleReset = async (designer) => {
    try {
      setResetLoading(true);
      const { data } = await axiosClient.put("admin/reset-designer/" + designer?.id);
      successToast(data.message + " Mot de passe : " + data.password, 5000, "top-right");
      setResetLoading(false);
      handleCloseConfirmReset();
      await getAllDesigners();
    } catch (error) {
      setResetLoading(false);
      handleCloseConfirmReset();
      errorToast("Une erreur est survenue");
    }
  };

  const columns = [
    { field: 'first_name', headerName: 'Nom', flex: 1.5 },
    { field: 'last_name', headerName: 'Prenom', flex: 1.5 },
    { field: 'is_cgcp', headerName: 'CGCP', flex: 0.6, renderCell: (params) => params.value ? 'Oui' : 'Non' },
    {
      field: 'email',
      headerName: 'E-mail',
      flex: 3,
      // renderCell: (params) => <a href={"mailto:" + params.value}>{params.value}</a> 
    },
    {
      field: 'actions',
      headerName: 'Les Actions',
      flex: 1.1,
      renderCell: (params) => {
        const designer = params.row;
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton sx={{ color: colors.greenAccent[500] }} onClick={() => handleOpenUpdate(designer)}>
              <EditIcon />
            </IconButton>
            <IconButton sx={{ color: colors.redAccent[500] }} onClick={() => handleOpenConfirmDelete(designer)}>
              <DeleteIcon />
            </IconButton>
            <IconButton sx={{ color: colors.blueAccent[500] }} onClick={() => handleOpenConfirmReset(designer)}>
              <LockResetIcon />
            </IconButton>
          </Box>
        );
      }
    }
  ];

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [openConfirmReset, setOpenConfirmReset] = useState(false);
  const [currentDesigner, setCurrentDesigner] = useState(null);

  const handleOpenCreate = () => setOpenCreate(true);
  const handleCloseCreate = () => setOpenCreate(false);

  const handleOpenUpdate = (designer) => {
    setCurrentDesigner(designer);
    setOpenUpdate(true);
  };
  const handleCloseUpdate = () => setOpenUpdate(false);

  const handleOpenConfirmDelete = (designer) => {
    setCurrentDesigner(designer);
    setOpenConfirmDelete(true);
  };
  const handleCloseConfirmDelete = () => setOpenConfirmDelete(false);

  const handleOpenConfirmReset = (designer) => {
    setCurrentDesigner(designer);
    setOpenConfirmReset(true);
  };
  const handleCloseConfirmReset = () => setOpenConfirmReset(false);

  return (
    <Box sx={{ mt: 1, pt: 2, px: 3 }}>
      <Button variant="contained" color="primary" onClick={handleOpenCreate} sx={{ mb: 3 }}>
        Ajouter une formateur
      </Button>
      <Modal open={openCreate} onClose={handleCloseCreate}>
        <Box sx={{ ...modalStyle }}>
          <CreateDesigner getAllDesigners={getAllDesigners} handleClose={handleCloseCreate} />
        </Box>
      </Modal>
      <Modal open={openUpdate} onClose={handleCloseUpdate}>
        <Box sx={{ ...modalStyle }}>
          <UpdateDesigner
            getAllDesigners={getAllDesigners}
            handleClose={handleCloseUpdate}
            designer={currentDesigner}
          />
        </Box>
      </Modal>
      <Modal open={openConfirmDelete} onClose={handleCloseConfirmDelete}>
        <Box sx={{ ...modalStyle }}>
          <Typography variant="h6">Confirmer la suppression</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>Voulez-vous vraiment supprimer ce formateur ?</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleCloseConfirmDelete} variant="contained" color="secondary" sx={{ mr: 2 }}>
              Annuler
            </Button>
            <Button onClick={() => deleteDesigner(currentDesigner)} variant="contained" color="error" disabled={deleteLoading}>
              {deleteLoading ? <CircularProgress size={12} /> : 'Supprimer'}
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal open={openConfirmReset} onClose={handleCloseConfirmReset}>
        <Box sx={{ ...modalStyle }}>
          <Typography variant="h6">Confirmer la réinitialisation</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>Voulez-vous vraiment réinitialiser le mot de passe de ce formateur ?</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleCloseConfirmReset} variant="contained" color="secondary" sx={{ mr: 2 }}>
              Annuler
            </Button>
            <Button onClick={() => handleReset(currentDesigner)} variant="contained" color="primary" disabled={resetLoading}>
              {resetLoading ? <CircularProgress size={12} /> : "Réinitialiser"}
            </Button>
          </Box>
        </Box>
      </Modal>
      {!designers ? (
        <Typography variant="h4" align="center" sx={{ mt: 5, pt: 5 }}>Chargement...</Typography>
      ) : (
        <Box sx={{ height: 600, width: '99%' }}>
          <DataGrid
            rows={designers}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </Box>
      )}
    </Box>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
  border: 'none',
};

export default AllDesigners;
