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
    <section style={{ minHeight: "100dvh" }}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="container">
            <div className="row d-flex justify-content-center my-4">
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
                  initial={{ opacity: 0, translateY: 50 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
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
            </div>
          </div>
          {/* <HomeStatistics /> */}
        </>
      )}
    </section>
  );
}

export default Home;
