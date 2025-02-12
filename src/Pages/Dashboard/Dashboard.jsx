import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../Components/NavBar";
import SideBar from "../../Components/SideBar";
import "../../Style/Dashboard.css";

function Dashboard() {
  return (
    <section className="dashboard-container">
      <div className="container-fluid dashboard-wrapper p-0">
        <NavBar />
        <div className="dashboard-content-area">
          <div className="dashboard-sidebar">
            <SideBar />
          </div>
          <div className="dashboard-outlet">
            <Outlet />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
