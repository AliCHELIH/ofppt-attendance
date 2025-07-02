import { useState, useEffect } from "react";
import { useAppContext } from "../../config/context/ComponentContext";
import { axiosClient } from "../../config/Api/AxiosClient";
import PropTypes from "prop-types";
import { errorToast, successToast } from "../../config/Toasts/toasts";

const CreateGroup = ({ open, onClose, getAllGroups, filieres }) => {
  const { setErrors, errors } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [designers, setDesigners] = useState([]);
  const [assignedDesigners, setAssignedDesigners] = useState([{ id: '', modules: '' }]);

  useEffect(() => {
    const fetchDesigners = async () => {
      try {
        const { data } = await axiosClient.get("/admin/designers");
        setDesigners(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDesigners();
  }, []);

  const handleAddDesigner = () => {
    setAssignedDesigners([...assignedDesigners, { id: '', modules: '' }]);
  };

  const handleRemoveDesigner = (index) => {
    const newAssignedDesigners = [...assignedDesigners];
    newAssignedDesigners.splice(index, 1);
    setAssignedDesigners(newAssignedDesigners);
  };

  const handleDesignerChange = (index, field, value) => {
    const newAssignedDesigners = [...assignedDesigners];
    newAssignedDesigners[index][field] = value;
    setAssignedDesigners(newAssignedDesigners);
  };

  const addGroup = async (e) => {
    setLoading(true);
    e.preventDefault();
    const { nom, filiere } = e.target.elements;
    try {
      await axiosClient.post("admin/groups", {
        nom: nom.value,
        filiere_id: filiere.value,
        designers: assignedDesigners,
      });
      await getAllGroups();
      onClose();
      successToast("Group added successfully");
    } catch (error) {
      errorToast('An error occurred');
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
        maxWidth: '600px',
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
          Add Group
        </h2>
        
        <form onSubmit={addGroup}>
          {/* Champ Nom */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '0.875rem',
              color: errors?.nom ? '#d32f2f' : '#333'
            }}>
              Name
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

          {/* Champ Filiere */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '0.875rem' 
            }}>
              Filiere
            </label>
            <select
              name="filiere"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '1rem',
                backgroundColor: 'white'
              }}
            >
              <option value="">Select a filiere</option>
              {filieres.map((filiere) => (
                <option key={filiere.id} value={filiere.id}>
                  {filiere.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Formateurs */}
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '600',
            margin: '24px 0 16px 0',
            color: '#333'
          }}>
            Formateur
          </h3>

          {assignedDesigners.map((designer, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '16px',
              gap: '12px'
            }}>
              <div style={{ flex: 1 }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '0.875rem' 
                }}>
                  Formateur
                </label>
                <select
                  value={designer.id}
                  onChange={(e) => handleDesignerChange(index, 'id', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Select a formateur</option>
                  {designers.map((designerOption) => (
                    <option key={designerOption.id} value={designerOption.id}>
                      {designerOption.first_name} {designerOption.last_name}
                    </option>
                  ))}
                </select>
                <span style={{ 
                  fontSize: '0.75rem', 
                  color: '#666',
                  marginTop: '4px',
                  display: 'block'
                }}>
                  Sélectionnez un formateur
                </span>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '0.875rem' 
                }}>
                  Modules
                </label>
                <input
                  type="text"
                  value={designer.modules}
                  onChange={(e) => handleDesignerChange(index, 'modules', e.target.value.split(','))}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontSize: '1rem'
                  }}
                />
                <span style={{ 
                  fontSize: '0.75rem', 
                  color: '#666',
                  marginTop: '4px',
                  display: 'block'
                }}>
                  Liste de modules séparés par des virgules
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveDesigner(index)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#d32f2f',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  padding: '8px',
                  marginTop: '20px'
                }}
              >
                ×
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddDesigner}
            style={{
              backgroundColor: '#000',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '10px 16px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}
          >
            <span>+</span> Add Formateur
          </button>

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
                fontWeight: '500'
              }}
            >
              Cancel
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
                gap: '8px'
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
                  animation: 'spin 1s linear infinite'
                }}></span>
              ) : null}
              Add
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

CreateGroup.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  getAllGroups: PropTypes.func.isRequired,
  filieres: PropTypes.array.isRequired,
};

export default CreateGroup;