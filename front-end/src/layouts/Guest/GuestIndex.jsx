import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppContext } from "../../config/context/ComponentContext";

const GuestIndex = () => {
  const { navigateTo } = useAppContext();

  useEffect(() => {
    if (
      localStorage.getItem("ud") &&
      JSON.parse(localStorage.getItem("ud")).role === "admin"
    ) {
      navigateTo("/administrateur");
    } else if (
      localStorage.getItem("ud") &&
      JSON.parse(localStorage.getItem("ud")).role === "designer"
    ) {
      navigateTo("/concepteur");
    } else if (
      localStorage.getItem("ud") &&
      JSON.parse(localStorage.getItem("ud")).role === "validator"
    ) {
      navigateTo("/gestionnaire");
    }
    document.title = "Home - OFPPT";
  }, []);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default GuestIndex;
