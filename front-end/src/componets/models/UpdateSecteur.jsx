import { useState } from "react";
import { useAppContext } from "../../config/context/ComponentContext";
import { axiosClient } from "../../config/Api/AxiosClient";
import { Modal, Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import PropTypes from "prop-types";
import { successToast } from "../../config/Toasts/toasts";

const UpdateSecteur = ({ open, onClose, secteur, getAllSecteurs }) => {
  const { setErrors, errors } = useAppContext();
  const [loading, setLoading] = useState(false);

  const updateSecteur = async (e) => {
    setLoading(true);
    e.preventDefault();
    const { nom } = e.target.elements;
    try {
      const { data } = await axiosClient.put(
        "admin/secteurs/" + secteur.id,
        {
          nom: nom.value,
        }
      );
      await getAllSecteurs();
      onClose();
      successToast(data.message);
    } catch (error) {
      setErrors(error.response.data.errors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: 1, maxWidth: 400, margin: 'auto', mt: 5 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Modifier Une Secteur
        </Typography>
        <form onSubmit={updateSecteur}>
          <TextField
            label="Nom"
            name="nom"
            defaultValue={secteur?.nom}
            fullWidth
            margin="normal"
            error={!!errors?.nom}
            helperText={errors?.nom}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={onClose} variant="contained" color="secondary" sx={{ mr: 1 }}>
              Annuler
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={12} /> : 'Modifier'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

UpdateSecteur.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  secteur: PropTypes.object.isRequired,
  getAllSecteurs: PropTypes.func.isRequired,
};

export default UpdateSecteur;
