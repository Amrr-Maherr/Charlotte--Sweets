import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import OrderBox from "../../../Components/HomeOrderBox/OrderBox";
import axios from "axios";
import Loader from "../Loader/Loader";
import HomeStatistics from "../../../Components/HomeStatistics";
import Chart from "../../../Components/Chart";
import ManagersRequests from "../../../Components/ManagersRequests/ManagersRequests";
import PendingRequests from "../../../Components/PendingRequests/PendingRequests";

function Home() {
  const [Orders, setOrders] = useState({});
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  useEffect(() => {
    axios
      .get("https://management.mlmcosmo.com/api/orders-stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setLoading(false);
        setOrders(response.data);
      })
      .catch(() => {
        setLoading(true);
      });
  }, [token]);

  return (
    <motion.section
      style={{ minHeight: "100dvh" }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="container">
            <motion.div
              className="row d-flex justify-content-center my-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[
                {
                  key: "completedOrders",
                  icon: "fa-check-circle",
                  bg: "#FFE3B9",
                  label: "الطلبات المكتمله",
                  link: "/dashboard/complete-orders",
                },
                {
                  key: "declinedOrders",
                  icon: "fa-times-circle",
                  bg: "#E4BCD5",
                  label: "الطلبات المرفوضه",
                  link: "/dashboard/rejected-orders",
                },
                {
                  key: "deliveredOrders",
                  icon: "fa-truck",
                  bg: "#D4C6F1",
                  label: "الطلبات الموصله",
                  link: "/dashboard/delivered-orders",
                },
                {
                  key: "newOrders",
                  icon: "fa-plus-circle",
                  bg: "#AEEDFB",
                  label: "الطلبات الجديده",
                  link: "/dashboard/new-orders",
                },
                {
                  key: "pendingOrders",
                  icon: "fa-clock-o",
                  bg: "#FBC3CD",
                  label: "الطلبات المعلقه",
                  link: "/dashboard/pending-orders",
                },
                {
                  key: "returnedOrders",
                  icon: "fa-undo",
                  bg: "#A8AFDF",
                  label: "الطلبات المرتجعه",
                  link: "/dashboard/returned-orders",
                },
              ].map((order, index) => (
                <motion.div
                  key={order.key}
                  className="col-xl-3 my-3"
                  variants={itemVariants}
                >
                  <OrderBox
                    icon={order.icon}
                    iconBg={order.bg}
                    orderStatus={order.label}
                    orderNumber={Orders[order.key]}
                    link={order.link}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
          <motion.div
            className="container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="row  d-flex justify-content-center"
              variants={containerVariants}
            >
              <motion.div
                className="col-xl-4 col-12  d-flex justify-content-center"
                variants={itemVariants}
              >
                <HomeStatistics />
              </motion.div>
              <motion.div
                className="col-xl-4 col-12 d-flex flex-column align-items-evenly justify-content-center"
                variants={itemVariants}
              >
                <ManagersRequests />
                <Chart />
              </motion.div>
              <motion.div className="col-xl-4 col-12" variants={itemVariants}>
                <PendingRequests />
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </motion.section>
  );
}

export default Home;
