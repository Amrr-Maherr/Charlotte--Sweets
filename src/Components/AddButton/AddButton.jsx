import "../../Style/AddButton/AddButton.css";
import { motion } from "framer-motion";

function AddButton({ ButtonText, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.8 }}
      className="addButton"
      onClick={onClick}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {ButtonText}
    </motion.button>
  );
}

export default AddButton;
