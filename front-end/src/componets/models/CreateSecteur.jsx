import { useState } from "react";
import { useAppContext } from "../../config/context/ComponentContext";
import { axiosClient } from "../../config/Api/AxiosClient";
import PropTypes from "prop-types";
import { successToast } from "../../config/Toasts/toasts";

const CreateSecteur = ({ open, onClose, getAllSecteurs }) => {
  const { setErrors, errors } = useAppContext();
  const [loading, setLoading] = useState(false);

  const addSecteur = async (e) => {
    setLoading(true);
    e.preventDefault();
    const { nom } = e.target.elements;
    try {
      const { data } = await axiosClient.post("admin/secteurs", {
        nom: nom.value,
      });
      await getAllSecteurs();
      onClose();
      successToast(data.message);
    } catch (error) {
      setErrors(error.response.data);
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
        maxWidth: '400px',
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
          Ajouter Un Secteur
        </h2>
        
        <form onSubmit={addSecteur}>
          {/* Champ Nom */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '0.875rem',
              color: errors?.nom ? '#2bbe9f' : '#333'
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
                border: errors?.nom ? '1px solid #2bbe9f' : '1px solid #ddd',
                fontSize: '1rem'
              }}
            />
            {errors?.nom && (
              <span style={{ 
                color: '#2bbe9f', 
                fontSize: '0.75rem', 
                marginTop: '4px', 
                display: 'block' 
              }}>
                {errors.nom}
              </span>
            )}
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

CreateSecteur.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  getAllSecteurs: PropTypes.func.isRequired,
};

export default CreateSecteur;