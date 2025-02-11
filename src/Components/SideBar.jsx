import React from "react";
import "../Style/SideBar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault(); // Prevent default link behavior
    try {
      const token = JSON.parse(localStorage.getItem("AuthToken"));
      await axios.post(
        "https://management.mlmcosmo.com/api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Clear token from localStorage
      localStorage.removeItem("AuthToken");

      // Redirect to login page
      navigate("/"); // Replace "/login" with your actual login route
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle logout error (e.g., display an error message)
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
              <i className="fa fa-home"></i> الرئيسية
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
              <i className="fa fa-code-fork"></i> الفروع
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
              <i className="fa fa-users"></i> المديرين
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
              <i className="fa fa-cutlery"></i> الشيفات
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
              <i className="fa fa-truck"></i> مندوبي التوصيل
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
              <i className="fa fa-line-chart"></i> السيلز
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
              <i className="fa fa-bullhorn"></i> الاعلانات
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
              <i className="fa fa-briefcase"></i> التخصصات
            </Link>
          </motion.li>
          <motion.li whileTap={{ scale: 0.9 }}>
            <Link
              to="/dashboard/flowers"
              className={
                location.pathname === "/dashboard/flowers" ? "active" : ""
              }
              aria-current={
                location.pathname === "/dashboard/flowers" ? "page" : undefined
              }
            >
              <i className="fa fa-leaf"></i> الورود
            </Link>
          </motion.li>
          <motion.li whileTap={{ scale: 0.9 }}>
            <Link
              to="/dashboard/products"
              className={
                location.pathname === "/dashboard/products" ? "active" : ""
              }
              aria-current={
                location.pathname === "/dashboard/products" ? "page" : undefined
              }
            >
              <i className="fa fa-cogs"></i> المنتجات
            </Link>
          </motion.li>
          <motion.li whileTap={{ scale: 0.9 }}>
            <Link
              to="#" // Use "#" as the href since it's not a real route
              className="logout-link" // Add a class for styling purposes
              onClick={handleLogout}
            >
              <i className="fa fa-sign-out"></i> تسجيل الخروج
            </Link>
          </motion.li>
        </ul>
      </aside>
    </>
  );
}

export default SideBar;
