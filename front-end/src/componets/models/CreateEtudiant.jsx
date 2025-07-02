import { useState } from "react";
import { useAppContext } from "../../config/context/ComponentContext";
import { axiosClient } from "../../config/Api/AxiosClient";
import PropTypes from "prop-types";
import { Modal, Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { errorToast, successToast } from "../../config/Toasts/toasts";

const CreateEtudiant = ({ open, onClose, getAllEtudiants, groups }) => {
  const { setErrors, errors } = useAppContext();
  const [loading, setLoading] = useState(false);

  const addEtudiant = async (e) => {
    setLoading(true);
    e.preventDefault();
    const { cin, group, nom, prenom, email, numero_parent, numero_stagiaire } = e.target.elements;
    try {
      await axiosClient.post("admin/etudiants", {
        nom: nom.value,
        prenom: prenom.value,
        cin: cin.value,
        email: email.value,
        group_id: group.value,
        numero_parent: numero_parent.value,
        numero_stagiaire: numero_stagiaire.value,
      });
      successToast("Stagiaire ajouté avec succès");
      await getAllEtudiants();
      onClose();
    } catch (error) {
      setErrors(error.response.data);
      errorToast("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: 1, maxWidth: 400, margin: 'auto', mt: 5 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Ajouter un Stagiaire
        </Typography>
        <form onSubmit={addEtudiant}>
          <TextField
            label="Nom"
            name="nom"
            fullWidth
            margin="normal"
            error={!!errors?.nom}
            helperText={errors?.nom}
            />
            <TextField
              label="Prénom"
              name="prenom"
              fullWidth
              margin="normal"
              error={!!errors?.prenom}
              helperText={errors?.prenom}
            />
            <TextField
              label="Email"
              name="email"
              fullWidth
              margin="normal"
              error={!!errors?.email}
              helperText={errors?.email}
            />
          <TextField
            label="CIN"
            name="cin"
            fullWidth
            margin="normal"
            error={!!errors?.cin}
            helperText={errors?.cin}
          />
          <TextField
            select
            label="Groupe"
            name="group"
            fullWidth
            margin="normal"
            SelectProps={{
              native: true,
            }}
          >
            <option value="">Sélectionner un groupe</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.nom}
              </option>
            ))}
          </TextField>
          <TextField
            label="Numéro Parent"
            name="numero_parent"
            fullWidth
            margin="normal"
            error={!!errors?.numero_parent}
            helperText={errors?.numero_parent}
          />
          <TextField
            label="Numéro Stagiaire"
            name="numero_stagiaire"
            fullWidth
            margin="normal"
            error={!!errors?.numero_stagiaire}
            helperText={errors?.numero_stagiaire}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={onClose} variant="contained" color="secondary" sx={{ mr: 1 }}>
              Annuler
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={12} /> : 'Ajouter'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

CreateEtudiant.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  getAllEtudiants: PropTypes.func.isRequired,
  groups: PropTypes.array.isRequired,
};

export default CreateEtudiant;
