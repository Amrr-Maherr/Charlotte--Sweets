import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import OrderBox from "../../../Components/HomeOrderBox/OrderBox";
import axios from "axios";
import Loader from "../Loader/Loader";
import HomeStatistics from "../../../Components/HomeStatistics";

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
                  label: "Completed Orders",
                  link: "/dashboard/complete-orders",
                },
                {
                  key: "declinedOrders",
                  icon: "fa-times-circle",
                  bg: "#E4BCD5",
                  label: "Declined Orders",
                  link: "/dashboard/rejected-orders",
                },
                {
                  key: "deliveredOrders",
                  icon: "fa-truck",
                  bg: "#D4C6F1",
                  label: "Delivered Orders",
                  link: "/dashboard/delivered-orders",
                },
                {
                  key: "newOrders",
                  icon: "fa-plus-circle",
                  bg: "#AEEDFB",
                  label: "New Orders",
                  link: "/dashboard/new-orders",
                },
                {
                  key: "pendingOrders",
                  icon: "fa-clock-o",
                  bg: "#FBC3CD",
                  label: "Pending Orders",
                  link: "/dashboard/pending-orders",
                },
                {
                  key: "returnedOrders",
                  icon: "fa-undo",
                  bg: "#A8AFDF",
                  label: "Returned Orders",
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
          <HomeStatistics/>
        </>
      )}
    </motion.section>
  );
}

export default Home;
