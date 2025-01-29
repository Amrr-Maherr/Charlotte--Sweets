import React from "react";
import "../../Style/StatBox.css";
import { motion } from "framer-motion";
function StatBox({ statTitle, num, icon, bgColor }) {
  return (
    <motion.div whileHover={{scale:1.1}} className="stat-box">
      <div className="stat-box-content">
        <div className="stat-box-number">{num}</div>
        <div className="stat-box-title">{statTitle}</div>
      </div>
      <div className="stat-box-icon">
        <i style={{ backgroundColor: bgColor }} className={`fa ${icon}`}></i>
      </div>
    </motion.div>
  );
}

export default StatBox;
