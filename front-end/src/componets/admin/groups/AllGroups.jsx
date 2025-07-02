import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { axiosClient } from "../../../config/Api/AxiosClient";
import { useAppContext } from "../../../config/context/ComponentContext";
import { Button, Modal, Box, IconButton, Typography, CircularProgress } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { errorToast, successToast } from "../../../config/Toasts/toasts";
import CreateGroup from "../../models/CreateGroup";
import UpdateGroup from "../../models/UpdateGroup";

const AllGroups = () => {
  const [groups, setGroups] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { setErrors } = useAppContext();
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState({ open: false, group: null });
  const [openConfirm, setOpenConfirm] = useState({ open: false, group: null });

  const getAllGroups = async () => {
    try {
      const { data } = await axiosClient.get("admin/groups");
      console.log("Fetched groups:", data);
      setGroups(data);
      setErrors(null);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteGroup = async (group) => {
    setDeleteLoading(true);
    try {
      await axiosClient.delete("admin/groups/" + group.id);
      successToast("Group deleted successfully");
    } catch (error) {
      errorToast("An error occurred, please try again");
    } finally {
      setDeleteLoading(false);
      setOpenConfirm({ open: false, group: null });
      await getAllGroups();
    }
  };

  const getFilieres = async () => {
    try {
      const { data } = await axiosClient.get("admin/filieres");
      console.log("Fetched filieres:", data);
      setFilieres(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    document.title = "All Groups - OFPPT";
    getAllGroups();
    getFilieres();
  }, []);

  const columns = [
    { field: 'nom', headerName: 'Name', flex: 3 },
    {
      field: 'filiere',
      headerName: 'Filiere',
      flex: 3,
      renderCell: (params) => {
        return params.row.filiere ? params.row.filiere.nom : '';
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => {
        return (
          <div className="d-flex gap-1 flex-nowrap">
            <IconButton color="success" onClick={() => setOpenUpdate({ open: true, group: params.row })}>
              <Edit />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => setOpenConfirm({ open: true, group: params.row })}
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
    deleteGroup(openConfirm.group);
  };

  return (
    <Box sx={{ mt: 1, pt: 2, px: 3 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenCreate(true)}
        className="mb-3"
      >
        Add Group
      </Button>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={groups}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) => row.id}
        />
      </Box>
      <CreateGroup
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        getAllGroups={getAllGroups}
        filieres={filieres}
      />
      {openUpdate.group && (
        <UpdateGroup
          open={openUpdate.open}
          onClose={() => setOpenUpdate({ open: false, group: null })}
          group={openUpdate.group}
          getAllGroups={getAllGroups}
          filieres={filieres}
        />
      )}
      <Modal
        open={openConfirm.open}
        onClose={() => setOpenConfirm({ open: false, group: null })}
      >
        <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: 1, maxWidth: 400, margin: 'auto', mt: 5 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Confirm Deletion
          </Typography>
          <Typography>
            Are you sure you want to delete this group?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={() => setOpenConfirm({ open: false, group: null })} variant="contained" color="secondary" sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} variant="contained" color="primary" disabled={deleteLoading}>
              {deleteLoading ? <CircularProgress size={12} /> : 'Delete'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AllGroups;
