import PendingRequests from "./PendingRequests/PendingRequests";
import StatisticsList from "./StatisticsList/StatisticsList";
import Chart from "../Components/Chart";
import TotalPendingRequests from "./TotalPendingRequests/TotalPendingRequests";
import { motion } from "framer-motion"; // Import framer-motion

function HomeStatistics() {
  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 50, // Start 50 pixels below its final position
    },
    visible: {
      opacity: 1,
      y: 0, // Animate to its final position
      transition: {
        duration: 0.5, // Animation duration in seconds
        delayChildren: 0.3, // Delay before animating children
        staggerChildren: 0.2, // Stagger the animation of children
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.section
      style={{ marginTop: "47px"}}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container">
        <motion.div
          className="row d-flex align-items-start justify-content-evenly"
          variants={itemVariants}
        >
          <div className="col-xl-4 col-12">
            <motion.div variants={itemVariants}>
              <StatisticsList />
            </motion.div>
          </div>
          <div className="col-xl-4 col-12 d-flex align-items-center justify-content-between flex-column">
            <motion.div variants={itemVariants}>
              <TotalPendingRequests />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Chart />
            </motion.div>
          </div>
          <div className="col-xl-4 col-12">
            <motion.div variants={itemVariants}>
              <PendingRequests />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default HomeStatistics;
