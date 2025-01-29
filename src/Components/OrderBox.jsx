import "../Style/OrderBox.css";
import { motion } from "framer-motion";
function OrderBox({ title, count, iconColor,icon }) {
  return (
    <motion.div whileHover={{scale:1.1}} className="card">
      <div className="card-body">
        <div className="card-text">
          <p className="card-num">{count}</p>
          <p className="card-num-text">{title}</p>
        </div>
        <i
          className={`fa ${icon} fa-lg me-3`}
          style={{ backgroundColor: iconColor}}
        ></i>
      </div>
    </motion.div>
  );
}

export default OrderBox;
