import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAppContext } from "../../config/context/ComponentContext";
import SidebarGestionnaire from "./global/SidebarGestionnaire";
import TopbarGestionnaire from "./global/TopbarGestionnaire";

const GestionnaireIndex = () => {
  const { navigateTo } = useAppContext();
  const [isSidebar, setIsSidebar] = useState(true)


  useEffect(() => {
    if (
      localStorage.getItem("ud") &&
      JSON.parse(localStorage.getItem("ud")).role === "validator"
    ) {
      document.title = "Gestionnaire Dashboard - OFPPT";
    } else {
      navigateTo("/");
    }
  }, []);

  return (
    <div className="app">
      <SidebarGestionnaire isSidebar={isSidebar} />
      <main className="content">
        <TopbarGestionnaire setIsSidebar={setIsSidebar} />
        <Outlet />
      </main>
    </div>
  )
};

export default GestionnaireIndex;
