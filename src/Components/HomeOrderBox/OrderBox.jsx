import { Link } from "react-router-dom";
import "../../Style/Home/HomeOrderBox/HomeOrderBox.css"
import { motion } from "framer-motion";
function OrderBox({ orderNumber, orderStatus, iconBg, icon }) {
  return (
    <>
      <Link style={{ textDecoration: "none" }}>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.8 }}
          className="card order-box-card shadow-sm"
        >
          <div className="card-info">
            <p className="card-number">{orderNumber}</p>
            <p className="card-text">{orderStatus}</p>
          </div>
          <div className="card-icon" style={{ backgroundColor: iconBg }}>
            <i className={`fa ${icon}`} style={{ backgroundColor: iconBg }}></i>
          </div>
        </motion.div>
      </Link>
    </>
  );
}
export default OrderBox