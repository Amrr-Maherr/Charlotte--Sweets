import "../../Style/AddButton/AddButton.css";
import { motion } from "framer-motion";

function AddButton({ ButtonText, onClick, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.8 }}
      className="addButton shadow-sm"
      onClick={onClick}
      transition={{ type: "spring", stiffness: 300 }}
      {...props} // تمرير جميع الخصائص الأخرى هنا
    >
      {ButtonText}
    </motion.button>
  );
}

export default AddButton;
