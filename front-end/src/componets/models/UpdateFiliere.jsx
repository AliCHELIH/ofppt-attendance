import { useState } from "react";
import { useAppContext } from "../../config/context/ComponentContext";
import { axiosClient } from "../../config/Api/AxiosClient";
import { Modal, Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import PropTypes from "prop-types";
import { errorToast, successToast } from "../../config/Toasts/toasts";

const UpdateFiliere = ({ open, onClose, filiere, getAllFilieres, secteurs }) => {
  const { setErrors, errors } = useAppContext();
  const [loading, setLoading] = useState(false);

  const updateFiliere = async (e) => {
    setLoading(true);
    e.preventDefault();
    const { nom, code, secteur } = e.target.elements;
    try {
      await axiosClient.put(
        "admin/filieres/" + filiere?.id,
        {
          nom: nom.value,
          code: code.value,
          secteur_id: secteur.value,
        }
      );
      await getAllFilieres();
      onClose();
      successToast("Filière modifiée avec succès");
    } catch (error) {
      errorToast('Une erreur est survenue');
      setErrors(error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: 1, maxWidth: 400, margin: 'auto', mt: 5 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Modifier Une Filière
        </Typography>
        <form onSubmit={updateFiliere}>
          <TextField
            label="Nom"
            name="nom"
            defaultValue={filiere?.nom}
            fullWidth
            margin="normal"
            error={!!errors?.nom}
            helperText={errors?.nom}
          />
          <TextField
            label="Code"
            name="code"
            defaultValue={filiere?.code}
            fullWidth
            margin="normal"
            error={!!errors?.code}
            helperText={errors?.code}
          />
          <TextField
            select
            label="Secteur"
            name="secteur"
            defaultValue={filiere?.secteur_id}
            fullWidth
            margin="normal"
            SelectProps={{
              native: true,
            }}
          >
            <option value="">Sélectionner un secteur</option>
            {secteurs.map((secteur) => (
              <option key={secteur.id} value={secteur.id}>
                {secteur.nom}
              </option>
            ))}
          </TextField>
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

UpdateFiliere.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  filiere: PropTypes.object.isRequired,
  getAllFilieres: PropTypes.func.isRequired,
  secteurs: PropTypes.array.isRequired,
};

export default UpdateFiliere;
