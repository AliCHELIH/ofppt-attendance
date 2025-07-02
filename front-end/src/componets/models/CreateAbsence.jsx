import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../config/context/ComponentContext";
import { axiosClient } from "../../config/Api/AxiosClient";
import PropTypes from "prop-types";
import { successToast } from "../../config/Toasts/toasts";

const CreateAbsence = ({ targetModel, getAllDesigners, role }) => {
  const { setErrors, errors } = useAppContext();
  const [loading, setLoading] = useState(false);
  const cancelModel = useRef();
  const addAbsence = async (e) => {
    setLoading(true);
    e.preventDefault();
    const { etudiant, commentaire, duree } = e.target.elements;

    console.log(commentaire);
    try {
      const { data } = await axiosClient.post(`${`/${role}/absences`}`, {
        etudiant_id: etudiant?.value,
        commentaire: commentaire?.value,
        duree: duree?.value,
      });
      console.log(data);
      successToast(data.message);
      await getAllDesigners();
      cancelModel.current.click();
    } catch (error) {
      console.error(error);
      setErrors(error.response.data.errors);
    } finally {
      setLoading(false);
    }
  };
  const [etudiants, setEtudiants] = useState([]);

  const getEtudiants = async () => {
    try {
      const { data } = await axiosClient.get(`${`/${role}/etudiants`}`);
      setEtudiants(data);
      console.log(data);
      setErrors(null);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEtudiants();
  }, []);
  return (
    <div
      className="modal fade"
      id={targetModel}
      tabIndex={-1}
      aria-labelledby="CreateAbsence"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="CreateAbsence">
              Ajouter Une Absence
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <form onSubmit={addAbsence}>
              <div data-mdb-input-init className="form-outline mb-4">
                <label className="form-label" htmlFor="form2Example2">
                  Etudiant <span className="text text-danger">*</span>
                </label>
                <div className="mb-3">
                  <select
                    className={`form-select form-select-lg ${(errors?.etudiant ? " is-invalid" : "")}`}
                    type="etudiant"
                    id="form2Example2"
                    name="etudiant"
                  >
                    <option selected>Select one</option>
                    {etudiants?.map((etudiant) => (
                      <option key={etudiant?.id} value={etudiant?.id}>{etudiant?.nom} {etudiant?.prenom}</option>
                    ))}
                  </select>
                </div>

                <span className="text text-danger">{errors?.etudiant}</span>
              </div>

              <div data-mdb-input-init className="form-outline mb-4">
                <label className="form-label" htmlFor="form2Example2">
                  Commentaire <span className="text text-danger">*</span>
                </label>
                <textarea type="commentaire" name="commentaire" id="form2Example2"
                  className={
                    "form-control" + (errors?.commentaire ? " is-invalid" : "")
                  }></textarea>
                <span className="text text-danger">{errors?.commentaire}</span>
              </div>

              <div data-mdb-input-init className="form-outline mb-4">
                <label className="form-label" htmlFor="form2Example2">
                  Duree <span className="text text-danger">*</span>
                </label>
                <input type="number" name="duree" id="form2Example2"
                  className={
                    "form-control" + (errors?.duree ? " is-invalid" : "")
                  } />
                <span className="text text-danger">{errors?.duree}</span>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  ref={cancelModel}
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : (
                    "Ajouter"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

CreateAbsence.propTypes = {
  targetModel: PropTypes.string.isRequired,
  getAllDesigners: PropTypes.func.isRequired,
};

export default CreateAbsence;
