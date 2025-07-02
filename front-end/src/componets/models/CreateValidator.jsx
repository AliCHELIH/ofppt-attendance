import { useState } from "react";
import { useAppContext } from "../../config/context/ComponentContext";
import { axiosClient } from "../../config/Api/AxiosClient";
import { Modal, Box, TextField, Button, Typography, Checkbox, FormControlLabel } from '@mui/material';
import PropTypes from "prop-types";
import { errorToast, successToast } from "../../config/Toasts/toasts";

const CreateValidator = ({ open, onClose, getAllGestionnaires }) => {
  const { setErrors, errors } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [isConseiller, setIsConseiller] = useState(false);
  const [isCgcp, setIsCgcp] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsConseiller(event.target.checked);
  };

  const handleCgcpChange = (event) => {
    setIsCgcp(event.target.checked);
  };

  const addValidator = async (e) => {
    setLoading(true);
    e.preventDefault();
    const { first_name, last_name, email } = e.target.elements;
    try {
      const { data } = await axiosClient.post("admin/validators", {
        first_name: first_name.value,
        last_name: last_name.value,
        email: email.value,
        is_conseiller: isConseiller,
        is_cgcp: isCgcp
      });
      await getAllGestionnaires();
      onClose();
      successToast(data.message + " Mot de passe : " + data.password, 5000, "top-right");
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
          Ajouter Une Gestionnaire
        </Typography>
        <form onSubmit={addValidator}>
          <TextField
            label="Nom"
            name="first_name"
            fullWidth
            margin="normal"
            error={!!errors?.first_name}
            helperText={errors?.first_name}
          />
          <TextField
            label="Prenom"
            name="last_name"
            fullWidth
            margin="normal"
            error={!!errors?.last_name}
            helperText={errors?.last_name}
          />
          <TextField
            label="E-mail"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            error={!!errors?.email}
            helperText={errors?.email}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isConseiller}
                onChange={handleCheckboxChange}
                name="is_conseiller"
                color="primary"
              />
            }
            label="Conseiller"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isCgcp}
                onChange={handleCgcpChange}
                name="is_cgcp"
                color="primary"
              />
            }
            label="CGCP"
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={onClose} variant="contained" color="secondary" sx={{ mr: 1 }}>
              Annuler
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? 'Ajout...' : 'Ajouter'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

CreateValidator.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  getAllGestionnaires: PropTypes.func.isRequired,
}

export default CreateValidator;
