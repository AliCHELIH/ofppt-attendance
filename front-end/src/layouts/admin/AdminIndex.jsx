import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAppContext } from "../../config/context/ComponentContext";
import SidebarAdmin from "./global/SidebarAdmin";
import TopbarAdmin from "./global/TopbarAdmin";

const AdminIndex = () => {
  const { navigateTo } = useAppContext();
  useEffect(() => {
    if (
      localStorage.getItem("ud") &&
      JSON.parse(localStorage.getItem("ud")).role === "admin"
    ) {
      document.title = "Admin Dashboard - OFPPT";
    } else {
      navigateTo("/");
    }
  }, []);

  const [isSidebar, setIsSidebar] = useState(true)

  return (
    <div className="app">
      <SidebarAdmin isSidebar={isSidebar} />
      <main className="content">
        <TopbarAdmin setIsSidebar={setIsSidebar} />
        <Outlet />
      </main>
    </div>
  );
};

export default AdminIndex;
