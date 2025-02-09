import { Link } from "react-router-dom";
import "../../Style/Home/HomeOrderBox/HomeOrderBox.css";
import { motion } from "framer-motion";

function OrderBox({ orderNumber, orderStatus, iconBg, icon, link }) {
  const content = (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.8 }}
      className="card order-box-card shadow-sm"
    >
      <div className="card-info">
        <p className="card-number">{orderNumber ?? 0}</p>
        <p className="card-text">{orderStatus}</p>
      </div>
      <div className="card-icon" style={{ backgroundColor: iconBg }}>
        <i className={`fa ${icon}`}></i>
      </div>
    </motion.div>
  );

  return link ? (
    <Link to={link} style={{ textDecoration: "none" }}>
      {content}
    </Link>
  ) : (
    content
  );
}

export default OrderBox;
