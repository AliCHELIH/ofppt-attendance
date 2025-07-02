import { useState } from "react";
import { useAppContext } from "../../config/context/ComponentContext";
import { axiosClient } from "../../config/Api/AxiosClient";
import PropTypes from "prop-types";
import { errorToast, successToast } from "../../config/Toasts/toasts";

const CreateFiliere = ({ open, onClose, getAllFilieres, secteurs }) => {
  const { setErrors, errors } = useAppContext();
  const [loading, setLoading] = useState(false);

  const addFiliere = async (e) => {
    setLoading(true);
    e.preventDefault();
    const { nom, code, secteur } = e.target.elements;
    try {
      await axiosClient.post("admin/filieres", {
        nom: nom.value,
        code: code.value,
        secteur_id: secteur.value,
      });
      await getAllFilieres();
      onClose();
      successToast("Filière ajoutée avec succès");
    } catch (error) {
      errorToast('Une erreur est survenue');
      setErrors(error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }} onClick={onClose}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '90%',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }} onClick={e => e.stopPropagation()}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          marginBottom: '20px',
          color: '#333'
        }}>
          Ajouter Une Filière
        </h2>
        
        <form onSubmit={addFiliere}>
          {/* Champ Nom */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '0.875rem',
              color: errors?.nom ? '#d32f2f' : '#333'
            }}>
              Nom
            </label>
            <input
              type="text"
              name="nom"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: errors?.nom ? '1px solid #d32f2f' : '1px solid #ddd',
                fontSize: '1rem'
              }}
            />
            {errors?.nom && (
              <span style={{ 
                color: '#d32f2f', 
                fontSize: '0.75rem', 
                marginTop: '4px', 
                display: 'block' 
              }}>
                {errors.nom}
              </span>
            )}
          </div>

          {/* Champ Code */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '0.875rem',
              color: errors?.code ? '#d32f2f' : '#333'
            }}>
              Code
            </label>
            <input
              type="text"
              name="code"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: errors?.code ? '1px solid #d32f2f' : '1px solid #ddd',
                fontSize: '1rem'
              }}
            />
            {errors?.code && (
              <span style={{ 
                color: '#d32f2f', 
                fontSize: '0.75rem', 
                marginTop: '4px', 
                display: 'block' 
              }}>
                {errors.code}
              </span>
            )}
          </div>

          {/* Champ Secteur */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '0.875rem' 
            }}>
              Secteur
            </label>
            <select
              name="secteur"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '1rem',
                backgroundColor: 'white'
              }}
            >
              <option value="">Sélectionner un secteur</option>
              {secteurs.map((secteur) => (
                <option key={secteur.id} value={secteur.id}>
                  {secteur.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Boutons */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: '12px',
            marginTop: '16px'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                backgroundColor: '#2bbe9f',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2bbe9f'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#2bbe9f'}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
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
                gap: '8px',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#000')}
              onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#000')}
            >
              {loading ? (
                <span style={{
                  display: 'inline-block',
                  width: '12px',
                  height: '12px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></span>
              ) : null}
              Ajouter
            </button>
          </div>
        </form>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

CreateFiliere.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  getAllFilieres: PropTypes.func.isRequired,
  secteurs: PropTypes.array.isRequired,
};

export default CreateFiliere;