import React from "react";
import "../Style/SideBar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem("AuthToken"));
      await axios.post(
        "https://management.mlmcosmo.com/api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      localStorage.removeItem("AuthToken");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <aside className="d-none d-lg-block">
        <ul>
          <motion.li whileTap={{ scale: 0.9 }}>
            <Link
              to="/dashboard/home"
              className={
                location.pathname === "/dashboard/home" ? "active" : ""
              }
              aria-current={
                location.pathname === "/dashboard/home" ? "page" : undefined
              }
            >
              <i className="fa fa-home"></i> Home
            </Link>
          </motion.li>
          <motion.li whileTap={{ scale: 0.9 }}>
            <Link
              to="/dashboard/branches"
              className={
                location.pathname === "/dashboard/branches" ? "active" : ""
              }
              aria-current={
                location.pathname === "/dashboard/branches" ? "page" : undefined
              }
            >
              <i className="fa fa-code-fork"></i> Branches
            </Link>
          </motion.li>
          <motion.li whileTap={{ scale: 0.9 }}>
            <Link
              to="/dashboard/managers"
              className={
                location.pathname === "/dashboard/managers" ? "active" : ""
              }
              aria-current={
                location.pathname === "/dashboard/managers" ? "page" : undefined
              }
            >
              <i className="fa fa-users"></i> Managers
            </Link>
          </motion.li>
          <motion.li whileTap={{ scale: 0.9 }}>
            <Link
              to="/dashboard/chefs"
              className={
                location.pathname === "/dashboard/chefs" ? "active" : ""
              }
              aria-current={
                location.pathname === "/dashboard/chefs" ? "page" : undefined
              }
            >
              <i className="fa fa-cutlery"></i> Chefs
            </Link>
          </motion.li>
          <motion.li whileTap={{ scale: 0.9 }}>
            <Link
              to="/dashboard/sales-representatives"
              className={
                location.pathname === "/dashboard/sales-representatives"
                  ? "active"
                  : ""
              }
              aria-current={
                location.pathname === "/dashboard/sales-representatives"
                  ? "page"
                  : undefined
              }
            >
              <i className="fa fa-truck"></i> Delivery
            </Link>
          </motion.li>
          <motion.li whileTap={{ scale: 0.9 }}>
            <Link
              to="/dashboard/sales"
              className={
                location.pathname === "/dashboard/sales" ? "active" : ""
              }
              aria-current={
                location.pathname === "/dashboard/sales" ? "page" : undefined
              }
            >
              <i className="fa fa-line-chart"></i> Sales
            </Link>
          </motion.li>
          <motion.li whileTap={{ scale: 0.9 }}>
            <Link
              to="/dashboard/ads"
              className={location.pathname === "/dashboard/ads" ? "active" : ""}
              aria-current={
                location.pathname === "/dashboard/ads" ? "page" : undefined
              }
            >
              <i className="fa fa-bullhorn"></i> Ads
            </Link>
          </motion.li>
          <motion.li whileTap={{ scale: 0.9 }}>
            <Link
              to="/dashboard/specialties"
              className={
                location.pathname === "/dashboard/specialties" ? "active" : ""
              }
              aria-current={
                location.pathname === "/dashboard/specialties"
                  ? "page"
                  : undefined
              }
            >
              <i className="fa fa-briefcase"></i> Specialties
            </Link>
          </motion.li>
          <motion.li whileTap={{ scale: 0.9 }}>
            <Link
              to="/dashboard/payment-reports"
              className={
                location.pathname === "/dashboard/payment-reports"
                  ? "active"
                  : ""
              }
              aria-current={
                location.pathname === "/dashboard/payment-reports"
                  ? "page"
                  : undefined
              }
            >
              <i className="fa fa-file-text"></i> Reports{" "}
              {/* تم تغيير الأيقونة هنا */}
            </Link>
          </motion.li>
          {/* Profile Link */}
          <motion.li whileTap={{ scale: 0.9 }}>
            <Link
              to="/dashboard/profile"
              className={
                location.pathname === "/dashboard/profile" ? "active" : ""
              }
              aria-current={
                location.pathname === "/dashboard/profile" ? "page" : undefined
              }
            >
              <i className="fa fa-user"></i> Profile
            </Link>
          </motion.li>
          <motion.li whileTap={{ scale: 0.9 }}>
            <Link to="#" className="logout-link" onClick={handleLogout}>
              <i className="fa fa-sign-out"></i> Logout
            </Link>
          </motion.li>
        </ul>
      </aside>
    </>
  );
}

export default SideBar;
