import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "../Api/AxiosClient";
import { errorToast, successToast } from "../Toasts/toasts";
import { Toaster } from "react-hot-toast";
import PropTypes from "prop-types";
import { CircularProgress, Box } from "@mui/material";

const Context = createContext({
  user: {},
  errors: {},
  alerts: [],
  fetchAlerts: () => { },
  handleLogin: () => { },
  navigateTo: () => { },
  setErrors: () => { },
});

const ComponentContext = ({ children }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      if (JSON.parse(localStorage.getItem("ud"))) {
        const state = await getUser(
          JSON.parse(localStorage.getItem("ud")).role
        );
        if (!state) {
          localStorage.removeItem("ud");
          navigate("/", { replace: true });
        }
      }
      setLoading(false);
    }
    fetchUser();
  }, []);


  async function fetchAlerts(role) {
    try {
      const { data } = await axiosClient.get(`${role}/alerts`);
      setAlerts(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (user.role === "admin") {
      fetchAlerts("admin");
    }
    if (user.role === "validator") {
      fetchAlerts("validator");
    }
  }, [user]);

  const getUser = async (guard) => {
    const ud = JSON.parse(localStorage.getItem("ud"));
    if (!ud) {
      return false;
    }
    if (ud.role !== guard) {
      return false;
    }
    try {
      const { data } = await axiosClient.get(`/${guard}/profile`);
      setUser(data);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  const handleLogin = async (formData, guard) => {
    try {
      const { data } = await axiosClient.post(`/${guard}/login`, formData);
      localStorage.setItem(
        "ud",
        JSON.stringify({ role: guard, _token: data.token })
      );
      successToast("Connexion reussie");
      setErrors({});
      const state = await getUser(guard);
      if (state) return true;
      else return false;
    } catch (error) {
      errorToast("Echec de la connexion");
      setErrors(error.response.data.errors);
      console.log(error);
      return false;
    }
  };
  return (
    <Context.Provider
      value={{
        user,
        handleLogin,
        navigateTo: navigate,
        errors,
        setErrors,
        alerts,
        fetchAlerts,
      }}
    >
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress
            size={60}
            thickness={5}
            style={{ color: "#00BFFF" }}
          />
        </Box>
      ) : (
        <>
          <Toaster
            toastOptions={{
              success: {
                style: {
                  background: "green",
                },
              },
              error: {
                style: {
                  background: "#CC0000",
                },
              },
              style: {
                color: "white",
                zIndex: 99999,
              },
            }}
          />
          {children}
        </>
      )}
    </Context.Provider>
  );
};

ComponentContext.propTypes = {
  children: PropTypes.node,
};

export default ComponentContext;

export const useAppContext = () => useContext(Context);
