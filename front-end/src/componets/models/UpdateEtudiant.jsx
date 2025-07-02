import { useState } from "react";
import { useAppContext } from "../../config/context/ComponentContext";
import { axiosClient } from "../../config/Api/AxiosClient";
import PropTypes from "prop-types";
import { Modal, Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { errorToast, successToast } from "../../config/Toasts/toasts";

const UpdateEtudiant = ({ open, onClose, etudiant, getAllEtudiants, groups }) => {
  const { setErrors, errors } = useAppContext();
  const [loading, setLoading] = useState(false);

  const updateEtudiant = async (e) => {
    setLoading(true);
    e.preventDefault();
    const { cin, nom, prenom, email, numero_parent, numero_stagiaire, group } = e.target.elements;
    try {
      const { data } = await axiosClient.put(
        "admin/etudiants/" + etudiant.id,
        {
          nom: nom.value,
          prenom: prenom.value,
          cin: cin.value,
          email: email.value,
          group_id: group.value,
          numero_parent: numero_parent.value,
          numero_stagiaire: numero_stagiaire.value,
        }
      );
      await getAllEtudiants();
      onClose();
      successToast("Étudiant modifié avec succès");
      console.log(data);
    } catch (error) {
      errorToast("Une erreur est survenue");
      setErrors(error.response.data.errors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: 1, maxWidth: 400, margin: 'auto', mt: 5 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Modifier un Étudiant
        </Typography>
        <form onSubmit={updateEtudiant}>
          <TextField
            label="Nom"
            name="nom"
            defaultValue={etudiant.nom}
            fullWidth
            margin="normal"
            error={!!errors?.nom}
            helperText={errors?.nom}
          />
          <TextField
            label="Prénom"
            name="prenom"
            defaultValue={etudiant.prenom}
            fullWidth
            margin="normal"
            error={!!errors?.prenom}
            helperText={errors?.prenom}
          />
          <TextField
            label="Email"
            name="email"
            defaultValue={etudiant.email}
            fullWidth
            margin="normal"
            error={!!errors?.email}
            helperText={errors?.email}
          />
          <TextField
            label="CIN"
            name="cin"
            defaultValue={etudiant.cin}
            fullWidth
            margin="normal"
            error={!!errors?.cin}
            helperText={errors?.cin}
          />
          <TextField
            select
            label="Groupe"
            name="group"
            defaultValue={etudiant.group_id}
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
            defaultValue={etudiant.numero_parent}
            fullWidth
            margin="normal"
            error={!!errors?.numero_parent}
            helperText={errors?.numero_parent}
          />
          <TextField
            label="Numéro Stagiaire"
            name="numero_stagiaire"
            defaultValue={etudiant.numero_stagiaire}
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
              {loading ? <CircularProgress size={12} /> : 'Modifier'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

UpdateEtudiant.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  etudiant: PropTypes.object.isRequired,
  getAllEtudiants: PropTypes.func.isRequired,
  groups: PropTypes.array.isRequired,
};

export default UpdateEtudiant;
