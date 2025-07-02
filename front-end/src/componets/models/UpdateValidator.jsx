import { useEffect, useState } from "react";
import { useAppContext } from "../../config/context/ComponentContext";
import { axiosClient } from "../../config/Api/AxiosClient";
import { Modal, Box, TextField, Button, Typography, FormControlLabel, Checkbox, CircularProgress } from '@mui/material';
import PropTypes from "prop-types";
import { errorToast, successToast } from "../../config/Toasts/toasts";

const UpdateValidator = ({ open, onClose, validator, getAllGestionnaires }) => {
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


  const updateValidator = async (e) => {
    setLoading(true);
    e.preventDefault();
    const { first_name, last_name, email } = e.target.elements;
    try {
      const { data } = await axiosClient.put(
        "admin/validators/" + validator.id,
        {
          first_name: first_name.value,
          last_name: last_name.value,
          email: email.value,
          is_conseiller: isConseiller,
          is_cgcp: isCgcp
        }
      );
      await getAllGestionnaires();
      onClose();
      successToast(data.message);
    } catch (error) {
      errorToast("Une erreur est survenue");
      setErrors(error.response.data.errors);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (validator) {
      setIsConseiller(validator.is_conseiller);
      setIsCgcp(validator.is_cgcp);
    }
  }, [validator]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: 1, maxWidth: 400, margin: 'auto', mt: 5 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Modifier Une Validateur
        </Typography>
        <form onSubmit={updateValidator}>
          <TextField
            label="Nom"
            name="first_name"
            defaultValue={validator?.first_name}
            fullWidth
            margin="normal"
            error={!!errors?.first_name}
            helperText={errors?.first_name}
          />
          <TextField
            label="Prenom"
            name="last_name"
            defaultValue={validator?.last_name}
            fullWidth
            margin="normal"
            error={!!errors?.last_name}
            helperText={errors?.last_name}
          />
          <TextField
            label="E-mail"
            name="email"
            type="email"
            defaultValue={validator?.email}
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
              {loading ? <CircularProgress size={12} color="success" /> : 'Modifier'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

UpdateValidator.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  validator: PropTypes.object.isRequired,
  getAllGestionnaires: PropTypes.func.isRequired,
};

export default UpdateValidator;
