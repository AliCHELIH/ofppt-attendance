import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { axiosClient } from "../../../config/Api/AxiosClient";
import { useAppContext } from "../../../config/context/ComponentContext";
import UpdateValidator from "../../models/UpdateValidator";
import CreateValidator from "../../models/CreateValidator";
import { errorToast, successToast } from "../../../config/Toasts/toasts";
import { Button, Modal, Box, IconButton, Typography, CircularProgress, useTheme } from '@mui/material';
import { Edit, Delete, Refresh } from '@mui/icons-material';
import { tokens } from "../../../theme";

const AllGestionnaires = () => {
  const [validators, setValidators] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const { setErrors } = useAppContext();
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState({ open: false, validator: null });
  const [openConfirm, setOpenConfirm] = useState({ open: false, validator: null, action: '' });
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const getAllGestionnaires = async () => {
    try {
      const { data } = await axiosClient.get("admin/validators");
      setValidators(data);
      setErrors(null);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteValidator = async (validator) => {
    setDeleteLoading(true);
    try {
      await axiosClient.delete("admin/validators/" + validator.id);
      successToast("Le gestionnaire a bien été supprimé");
      setOpenConfirm({ open: false, validator: null, action: '' });
      setDeleteLoading(false);
      await getAllGestionnaires();
    } catch (error) {
      setDeleteLoading(false);
      errorToast(error.response.data.message);
      setOpenConfirm({ open: false, validator: null, action: '' });
    }
  };

  const handleReset = async (validator) => {
    try {
      setResetLoading(true);
      const { data } = await axiosClient.put("admin/reset-validator/" + validator.id);
      successToast(data.message + " : " + data.password, 5000);
      setResetLoading(false);
      setOpenConfirm({ open: false, validator: null, action: '' });
      await getAllGestionnaires();
    } catch (error) {
      setResetLoading(false);
      errorToast(error.response.data.message);
      setOpenConfirm({ open: false, validator: null, action: '' });
    }
  };

  useEffect(() => {
    document.title = "Tous les gestionnaires - OFPPT";
    getAllGestionnaires();
  }, []);

  const columns = [
    { field: 'first_name', headerName: 'Nom', flex: 1.5 },
    { field: 'last_name', headerName: 'Prenom', flex: 1.5 },
    { field: 'is_conseiller', headerName: 'Conseiller', flex: 1, renderCell: (params) => params.value ? 'Oui' : 'Non' },
    { field: 'is_cgcp', headerName: 'CGCP', flex: 1, renderCell: (params) => params.value ? 'Oui' : 'Non' },
    {
      field: 'email',
      headerName: 'E-mail',
      flex: 3,
      // renderCell: (params) => <a href={"mailto:" + params.value}>{params.value}</a> 
    },
    {
      field: 'actions',
      headerName: 'Les Actions',
      flex: 1,
      renderCell: (params) => (
        <div className="d-flex gap-1 flex-nowrap">
          <IconButton sx={{ color: colors.greenAccent[500] }} onClick={() => setOpenUpdate({ open: true, validator: params.row })}>
            <Edit />
          </IconButton>
          <IconButton
            sx={{ color: colors.redAccent[500] }}
            onClick={() => setOpenConfirm({ open: true, validator: params.row, action: 'delete' })}
          >
            <Delete />
          </IconButton>
          <IconButton
            sx={{ color: colors.blueAccent[500] }}
            onClick={() => setOpenConfirm({ open: true, validator: params.row, action: 'reset' })}
          >
            <Refresh />
          </IconButton>
        </div>
      )
    },
  ];

  const handleConfirmAction = () => {
    if (openConfirm.action === 'delete') {
      deleteValidator(openConfirm.validator);
    } else if (openConfirm.action === 'reset') {
      handleReset(openConfirm.validator);
    }
  };

  return (
    <Box sx={{ mt: 1, pt: 2, px: 3 }}>
      <Button variant="contained" color="primary" onClick={() => setOpenCreate(true)} sx={{ mb: 3 }}>
        Ajouter une Gestionnaires
      </Button>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={validators}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Box>
      <CreateValidator
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        getAllGestionnaires={getAllGestionnaires}
      />
      {openUpdate.validator && (
        <UpdateValidator
          open={openUpdate.open}
          onClose={() => setOpenUpdate({ open: false, validator: null })}
          validator={openUpdate.validator}
          getAllGestionnaires={getAllGestionnaires}
        />
      )}
      <Modal
        open={openConfirm.open}
        onClose={() => setOpenConfirm({ open: false, validator: null, action: '' })}
      >
        <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: 1, maxWidth: 400, margin: 'auto', mt: 5 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Confirmer l&apos;action
          </Typography>
          <Typography>
            Êtes-vous sûr de vouloir {openConfirm.action === 'delete' ? 'supprimer' : 'réinitialiser le mot de passe de'} ce gestionnaire ?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={() => setOpenConfirm({ open: false, validator: null, action: '' })} variant="contained" color="secondary" sx={{ mr: 1 }}>
              Annuler
            </Button>
            <Button onClick={handleConfirmAction} variant="contained" color="primary">
              {deleteLoading || resetLoading ? <CircularProgress size={12} color="success" /> : "Confirmer"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AllGestionnaires;
