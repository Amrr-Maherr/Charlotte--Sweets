import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import logo_image from "../Assets/brand-logo.png";
import profile_image from "../Assets/profile-image.png";
import "../Style/NavBar.css";

function NavBar() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleLinkClick = (to) => {
    setActiveLink(to);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg  custom-navbar">
        <div className="container-fluid">
          <ul className="navbar-nav logo-image d-none d-lg-block">
            <li className="nav-item">
              <img src={logo_image} alt="Logo" />
            </li>
          </ul>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav">
              <li className="nav-item">
                <span className="nav-link dashboard-link" aria-disabled="true">
                  Control panel
                </span>
              </li>
            </ul>
          </div>
          <Link
            className="navbar-brand profile-image d-none d-lg-block"
            to="/dashboard/profile"
          >
            <img src={profile_image} alt="Profile" />
          </Link>

          <button
            className="btn  d-lg-none"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasScrolling"
            aria-controls="offcanvasScrolling"
          >
            <i class="fa fa-bars"></i>
          </button>
        </div>
      </nav>
      <div
        className="offcanvas offcanvas-end"
        data-bs-scroll="true"
        data-bs-backdrop="false"
        tabIndex="-1"
        id="offcanvasScrolling"
        aria-labelledby="offcanvasScrollingLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasScrollingLabel">
            القائمه
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul>
            {[
              { to: "/dashboard/home", icon: "fa-home", label: "الرئيسية" },
              {
                to: "/dashboard/branches",
                icon: "fa-code-fork",
                label: "الفروع",
              },
              {
                to: "/dashboard/managers",
                icon: "fa-users",
                label: "المديرين",
              },
              { to: "/dashboard/chefs", icon: "fa-cutlery", label: "الشيفات" },
              {
                to: "/dashboard/sales-representatives",
                icon: "fa-truck",
                label: "مناديب المبيعات",
              },
              {
                to: "/dashboard/sales",
                icon: "fa-line-chart",
                label: "السيلز",
              },
              { to: "/dashboard/ads", icon: "fa-bullhorn", label: "الاعلانات" },
              {
                to: "/dashboard/specialties",
                icon: "fa-briefcase",
                label: "التخصصات",
              },
              { to: "/dashboard/flowers", icon: "fa-leaf", label: "الورود" },
              { to: "/dashboard/products", icon: "fa-cogs", label: "المنتجات" },
            ].map((item, index) => (
              <motion.li key={index} whileTap={{ scale: 0.9 }}>
                <Link
                  to={item.to}
                  className={location.pathname === item.to ? "active" : ""}
                  onClick={() => handleLinkClick(item.to)}
                >
                  <i className={`fa ${item.icon}`}></i> {item.label}
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default NavBar;
