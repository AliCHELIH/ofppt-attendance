import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { axiosClient } from "../../../config/Api/AxiosClient";
import { useAppContext } from "../../../config/context/ComponentContext";
import CreateFiliere from "../../models/CreateFiliere";
import UpdateFiliere from "../../models/UpdateFiliere";
import { Button, Modal, Box, IconButton, Typography, CircularProgress } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { errorToast, successToast } from "../../../config/Toasts/toasts";

const AllFilieres = () => {
  const [filieres, setFilieres] = useState([]);
  const [secteurs, setSecteurs] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { setErrors } = useAppContext();
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState({ open: false, filiere: null });
  const [openConfirm, setOpenConfirm] = useState({ open: false, filiere: null });

  const getAllFilieres = async () => {
    try {
      const { data } = await axiosClient.get("admin/filieres");
      console.log("Fetched filieres:", data);
      setFilieres(data);
      setErrors(null);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFiliere = async (filiere) => {
    setDeleteLoading(true);
    try {
      await axiosClient.delete("admin/filieres/" + filiere.id);
      successToast("Filière supprimée avec succès");
    } catch (error) {
      errorToast("Une erreur est survenue, veuillez réessayer");
    } finally {
      setDeleteLoading(false);
      setOpenConfirm({ open: false, filiere: null });
      await getAllFilieres();
    }
  };

  const getSecteurs = async () => {
    try {
      const { data } = await axiosClient.get("/secteur");
      console.log("Fetched secteurs:", data);
      setSecteurs(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    document.title = "Tous les validateurs - OFPPT";
    getAllFilieres();
    getSecteurs();
  }, []);

  const columns = [
    { field: 'nom', headerName: 'Nom', flex: 3 },
    { field: 'code', headerName: 'Code', flex: 1 },
    {
      field: 'secteur',
      headerName: 'Secteur',
      flex: 3,
      renderCell: (params) => {
        console.log("params in renderCell for secteur:", params);
        return params.row.secteur ? params.row.secteur.nom : '';
      }
    },
    {
      field: 'actions',
      headerName: 'Les Actions',
      flex: 1,
      renderCell: (params) => {
        console.log("params in renderCell for actions:", params);
        return (
          <div className="d-flex gap-1 flex-nowrap">
            <IconButton color="success" onClick={() => setOpenUpdate({ open: true, filiere: params.row })}>
              <Edit />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => setOpenConfirm({ open: true, filiere: params.row })}
              disabled={deleteLoading}
            >
              <Delete />
            </IconButton>
          </div>
        );
      }
    },
  ];

  const handleConfirmDelete = () => {
    deleteFiliere(openConfirm.filiere);
  };

  return (
    <Box sx={{ mt: 1, pt: 2, px: 3 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenCreate(true)}
        className="mb-3"
      >
        Ajouter une filière
      </Button>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filieres}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) => row.id}
        />
      </Box>
      <CreateFiliere
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        getAllFilieres={getAllFilieres}
        secteurs={secteurs}
      />
      {openUpdate.filiere && (
        <UpdateFiliere
          open={openUpdate.open}
          onClose={() => setOpenUpdate({ open: false, filiere: null })}
          filiere={openUpdate.filiere}
          getAllFilieres={getAllFilieres}
          secteurs={secteurs}
        />
      )}
      <Modal
        open={openConfirm.open}
        onClose={() => setOpenConfirm({ open: false, filiere: null })}
      >
        <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: 1, maxWidth: 400, margin: 'auto', mt: 5 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Confirmer la suppression
          </Typography>
          <Typography>
            Êtes-vous sûr de vouloir supprimer cette filière ?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={() => setOpenConfirm({ open: false, filiere: null })} variant="contained" color="secondary" sx={{ mr: 1 }}>
              Annuler
            </Button>
            <Button onClick={handleConfirmDelete} variant="contained" color="primary" disabled={deleteLoading}>
              {deleteLoading ? <CircularProgress size={12} /> : 'Supprimer'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AllFilieres;
