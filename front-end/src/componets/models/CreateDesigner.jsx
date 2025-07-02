import { useState } from "react";
import { useAppContext } from "../../config/context/ComponentContext";
import { axiosClient } from "../../config/Api/AxiosClient";
import PropTypes from "prop-types";
import { errorToast, successToast } from "../../config/Toasts/toasts";

const CreateDesigner = ({ getAllDesigners, handleClose }) => {
  const { setErrors, errors } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [isCgcp, setIsCgcp] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsCgcp(event.target.checked);
  };

  const addDesigner = async (e) => {
    setLoading(true);
    e.preventDefault();
    const { first_name, is_cgcp, last_name, email } = e.target.elements;
    try {
      const { data } = await axiosClient.post("admin/designers", {
        first_name: first_name.value,
        last_name: last_name.value,
        email: email.value,
        is_cgcp: is_cgcp.checked,
      });
      await getAllDesigners();
      handleClose();
      successToast(data.message + "Mot de passe : " + data.password, 5000, "top-right");
    } catch (error) {
      errorToast("Une erreur est survenue");
      setErrors(error.response.data.errors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={addDesigner} style={{ padding: '16px' }}>
      <h2 style={{ marginBottom: '16px', fontSize: '1.25rem', fontWeight: '600' }}>Ajouter Un Formateur</h2>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem' }}>Nom</label>
        <input
          type="text"
          name="first_name"
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: errors?.first_name ? '1px solid #d32f2f' : '1px solid #ccc',
            fontSize: '1rem'
          }}
        />
        {errors?.first_name && (
          <span style={{ color: '#d32f2f', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
            {errors.first_name}
          </span>
        )}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem' }}>Prénom</label>
        <input
          type="text"
          name="last_name"
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: errors?.last_name ? '1px solid #d32f2f' : '1px solid #ccc',
            fontSize: '1rem'
          }}
        />
        {errors?.last_name && (
          <span style={{ color: '#d32f2f', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
            {errors.last_name}
          </span>
        )}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem' }}>E-mail</label>
        <input
          type="email"
          name="email"
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: errors?.email ? '1px solid #d32f2f' : '1px solid #ccc',
            fontSize: '1rem'
          }}
        />
        {errors?.email && (
          <span style={{ color: '#d32f2f', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
            {errors.email}
          </span>
        )}
      </div>

      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
        <input
          type="checkbox"
          id="is_cgcp"
          name="is_cgcp"
          checked={isCgcp}
          onChange={handleCheckboxChange}
          style={{ marginRight: '8px' }}
        />
        <label htmlFor="is_cgcp" style={{ fontSize: '0.875rem' }}>CGCP</label>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
        <button
          type="button"
          onClick={handleClose}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2bbe9f',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            marginRight: '8px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#000',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            opacity: loading ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '80px'
          }}
        >
          {loading ? (
            <span style={{
              display: 'inline-block',
              width: '12px',
              height: '12px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: 'white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginRight: '8px'
            }}></span>
          ) : 'Ajouter'}
        </button>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  );
};

CreateDesigner.propTypes = {
  getAllDesigners: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default CreateDesigner;