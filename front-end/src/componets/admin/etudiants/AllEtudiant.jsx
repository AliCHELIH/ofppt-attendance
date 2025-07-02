import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { useAppContext } from "../../../config/context/ComponentContext";
import { axiosClient } from "../../../config/Api/AxiosClient";
import CreateEtudiant from "../../models/CreateEtudiant";
import UpdateEtudiant from "../../models/UpdateEtudiant";
import { Button, Modal, Box, IconButton, Typography, CircularProgress, Select, MenuItem } from '@mui/material';
import { Edit, Delete, RemoveRedEye } from '@mui/icons-material';
import { successToast, errorToast } from "../../../config/Toasts/toasts";
import { Link } from "react-router-dom";

export default function AllEtudiant() {
  const [etudiants, setEtudiants] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const { setErrors } = useAppContext();
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState({ open: false, etudiant: null });
  const [openConfirm, setOpenConfirm] = useState({ open: false, etudiant: null });

  const getAllEtudiants = async (groupId) => {
    try {
      let data;
      if (groupId === 'tous' || groupId === '') {
        const response = await axiosClient.get("admin/etudiants");
        data = response.data;
      } else {
        const response = await axiosClient.get(`admin/etudiants/group/${groupId}`);
        data = response.data;
      }
      setEtudiants(data);
      setErrors(null);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteEtudiant = async (etudiant) => {
    setDeleteLoading(true);
    try {
      await axiosClient.delete("admin/etudiants/" + etudiant.id);
      successToast("Etudiant supprimé avec succès");
      await getAllEtudiants(selectedGroup);
    } catch (error) {
      errorToast("Une erreur est survenue, veuillez réessayer");
    } finally {
      setDeleteLoading(false);
      setOpenConfirm({ open: false, etudiant: null });
    }
  };

  const getGroups = async () => {
    try {
      const { data } = await axiosClient.get("admin/groups");
      setGroups(data);
      if (data.length > 0) {
        setSelectedGroup(data[0].id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    document.title = "Tous les étudiants - OFPPT";
    getGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      getAllEtudiants(selectedGroup);
    }
  }, [selectedGroup]);

  const handleGroupChange = (event) => {
    setSelectedGroup(event.target.value);
  };

  const columns = [
    { field: 'nom', headerName: 'Nom', flex: 0.7 },
    { field: 'prenom', headerName: 'Prénom', flex: 0.7 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    { field: 'numero_stagiaire', headerName: 'Numéro Stagiaire', flex: 0.9, renderCell: (params) => `+212 ${params.row.numero_stagiaire}` },
    { field: 'numero_parent', headerName: 'Numéro Parent', flex: 0.9, renderCell: (params) => `+212 ${params.row.numero_parent}` },
    { field: 'group', headerName: 'Groupe', flex: 0.5, renderCell: (params) => params.row.group?.nom || '' },
    { field: 'filiere', headerName: 'Filière', flex: 1.4, renderCell: (params) => params.row.group?.filiere?.nom || '' },
    {
      field: 'actions',
      headerName: 'Les Actions',
      flex: 1,
      renderCell: (params) => (
        <div className="d-flex gap-1 flex-nowrap">
          <IconButton color="success" onClick={() => setOpenUpdate({ open: true, etudiant: params.row })}>
            <Edit />
          </IconButton>
          <Link to={`/administrateur/etudiant/${params.row.id}`}>
            <IconButton color="primary">
              <RemoveRedEye />
            </IconButton>
          </Link>
          <IconButton
            color="error"
            onClick={() => setOpenConfirm({ open: true, etudiant: params.row })}
            disabled={deleteLoading}
          >
            <Delete />
          </IconButton>
        </div>
      )
    },
  ];

  const handleConfirmDelete = () => {
    deleteEtudiant(openConfirm.etudiant);
  };

  return (
    <Box sx={{ mt: 1, pt: 2, px: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenCreate(true)}
        >
          Ajouter un stagiaire
        </Button>
        <Select
          value={selectedGroup}
          onChange={handleGroupChange}
          displayEmpty
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="tous">
            <em>Tous les groupes</em>
          </MenuItem>
          {groups.map((group) => (
            <MenuItem key={group.id} value={group.id}>
              {group.nom}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={etudiants}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) => row.id}
        />
      </Box>
      <CreateEtudiant
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        getAllEtudiants={() => getAllEtudiants(selectedGroup)}
        groups={groups}
      />
      {openUpdate.etudiant && (
        <UpdateEtudiant
          open={openUpdate.open}
          onClose={() => setOpenUpdate({ open: false, etudiant: null })}
          etudiant={openUpdate.etudiant}
          getAllEtudiants={() => getAllEtudiants(selectedGroup)}
          groups={groups}
        />
      )}
      <Modal
        open={openConfirm.open}
        onClose={() => setOpenConfirm({ open: false, etudiant: null })}
      >
        <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: 1, maxWidth: 400, margin: 'auto', mt: 5 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Confirmer la suppression
          </Typography>
          <Typography>
            Êtes-vous sûr de vouloir supprimer ce stagiaire ?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={() => setOpenConfirm({ open: false, etudiant: null })} variant="contained" color="secondary" sx={{ mr: 1 }}>
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
}
