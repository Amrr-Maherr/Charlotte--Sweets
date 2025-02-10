import { useState } from "react";
import "../Style/SideBar.css";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function SideBar() {
  const [activeLink, setActiveLink] = useState("");
  const location = useLocation();

  const handleLinkClick = (to) => {
    setActiveLink(to);
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
              onClick={() => handleLinkClick("/dashboard/home")}
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
              onClick={() => handleLinkClick("/dashboard/branches")}
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
              onClick={() => handleLinkClick("/dashboard/managers")}
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
              onClick={() => handleLinkClick("/dashboard/chefs")}
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
              onClick={() =>
                handleLinkClick("/dashboard/sales-representatives")
              }
            >
              <i className="fa fa-truck"></i>  مندوبي التوصيل
            </Link>
          </motion.li>
          <motion.li whileTap={{ scale: 0.9 }}>
            <Link
              to="/dashboard/sales"
              className={
                location.pathname === "/dashboard/sales" ? "active" : ""
              }
              onClick={() => handleLinkClick("/dashboard/sales")}
            >
              <i className="fa fa-line-chart"></i> السيلز
            </Link>
          </motion.li>
          <motion.li whileTap={{ scale: 0.9 }}>
            <Link
              to="/dashboard/ads"
              className={location.pathname === "/dashboard/ads" ? "active" : ""}
              onClick={() => handleLinkClick("/dashboard/ads")}
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
              onClick={() => handleLinkClick("/dashboard/specialties")}
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
              onClick={() => handleLinkClick("/dashboard/flowers")}
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
              onClick={() => handleLinkClick("/dashboard/products")}
            >
              <i className="fa fa-cogs"></i> المنتجات
            </Link>
          </motion.li>
        </ul>
      </aside>
    </>
  );
}

export default SideBar;
