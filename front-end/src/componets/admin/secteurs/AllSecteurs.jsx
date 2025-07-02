import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { axiosClient } from "../../../config/Api/AxiosClient";
import { useAppContext } from "../../../config/context/ComponentContext";
import CreateSecteur from "../../models/CreateSecteur";
import UpdateSecteur from "../../models/UpdateSecteur";
import { Button, Modal, Box, IconButton, Typography, CircularProgress } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { errorToast, successToast } from "../../../config/Toasts/toasts";

const AllSecteurs = () => {
  const [secteurs, setSecteurs] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { setErrors } = useAppContext();
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState({ open: false, secteur: null });
  const [openConfirm, setOpenConfirm] = useState({ open: false, secteur: null });

  const getAllSecteurs = async () => {
    try {
      const { data } = await axiosClient.get("admin/secteurs");
      setSecteurs(data);
      setErrors(null);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteSecteur = async (secteur) => {
    setDeleteLoading(true);
    try {
      await axiosClient.delete("admin/secteurs/" + secteur.id);
      successToast("Secteur supprime avec succes");
    } catch (error) {
      errorToast("Une erreur est survenue, veuillez reessayer");
    } finally {
      setDeleteLoading(false);
      setOpenConfirm({ open: false, secteur: null });
      await getAllSecteurs();
    }
  };

  useEffect(() => {
    document.title = "Tous les secteurs - OFPPT";
    getAllSecteurs();
  }, []);

  const columns = [
    { field: 'nom', headerName: 'Nom', flex: 8 },
    {
      field: 'actions',
      headerName: 'Les Actions',
      flex: 1,
      renderCell: (params) => (
        <div className="d-flex gap-1 flex-nowrap">
          <IconButton color="success" onClick={() => setOpenUpdate({ open: true, secteur: params.row })}>
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => setOpenConfirm({ open: true, secteur: params.row })}
            disabled={deleteLoading}
          >
            <Delete />
          </IconButton>
        </div>
      )
    },
  ];

  const handleConfirmDelete = () => {
    deleteSecteur(openConfirm.secteur);
  };

  return (
    <Box sx={{ mt: 1, pt: 2, px: 3 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenCreate(true)}
        className="mb-3"
      >
        Ajouter une secteur
      </Button>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={secteurs}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Box>
      <CreateSecteur
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        getAllSecteurs={getAllSecteurs}
      />
      {openUpdate.secteur && (
        <UpdateSecteur
          open={openUpdate.open}
          onClose={() => setOpenUpdate({ open: false, secteur: null })}
          secteur={openUpdate.secteur}
          getAllSecteurs={getAllSecteurs}
        />
      )}
      <Modal
        open={openConfirm.open}
        onClose={() => setOpenConfirm({ open: false, secteur: null })}
      >
        <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: 1, maxWidth: 400, margin: 'auto', mt: 5 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Confirmer la suppression
          </Typography>
          <Typography>
            Êtes-vous sûr de vouloir supprimer ce secteur ?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={() => setOpenConfirm({ open: false, secteur: null })} variant="contained" color="secondary" sx={{ mr: 1 }}>
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

export default AllSecteurs;
