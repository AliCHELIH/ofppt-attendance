import { useEffect, useState } from "react";
import { useAppContext } from "../../config/context/ComponentContext";
import SidebarFormateur from "./global/SidebarFormateur";
import TopbarFormateur from "./global/TopbarFormateur";
import { Outlet } from "react-router-dom";

const FormateurIndex = () => {
  const { navigateTo } = useAppContext();
  const [isSidebar, setIsSidebar] = useState(true)

  useEffect(() => {
    if (
      localStorage.getItem("ud") &&
      JSON.parse(localStorage.getItem("ud")).role === "designer"
    ) {
      document.title = "Formateur Dashboard - OFPPT";
    } else {
      navigateTo("/");
    }
  }, []);

  return (
    <div className="app">
      <SidebarFormateur isSidebar={isSidebar} />
      <main className="content">
        <TopbarFormateur setIsSidebar={setIsSidebar} />
      <Outlet />
      </main>
    </div>
  );
};

export default FormateurIndex;
