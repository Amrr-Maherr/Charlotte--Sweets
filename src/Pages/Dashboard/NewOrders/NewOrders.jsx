import axios from "axios";
import { useEffect, useState } from "react";
import "../../../Style/NewOrders/NewOrders.css";
import Eye from "../../../Assets/eye.svg";
import { motion } from "framer-motion"; // استيراد motion
import { Link } from "react-router-dom";

function NewOrders() {
  const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://management.mlmcosmo.com/api/new-orders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching new orders:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const totalPages = Math.ceil(Data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Data.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <div className="container new-order-container">
        <div className="row new-order-row">
          <div className="col-12 mt-5 text-end new-order-title">
            <h1>الطلبات الجديدة</h1>
          </div>
          <div className="col-12 mt-5">
            <table className="table text-center new-order-table">
              <thead>
                <tr>
                  <th>الاجرائات</th>
                  <th>السعر الكلي</th>
                  <th>نوع الطلب</th>
                  <th>#</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((order, index) => (
                  <motion.tr // استخدام motion.tr هنا
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 25,
                      delay: 0.1 * index,
                    }} // حركة Bounce مع تأخير حسب ترتيب الصف
                    key={order.id}
                  >
                    <td>
                      <div className="actions">
                        <Link to={`/dashboard/order-details/${order.id}`}>
                          <img src={Eye} alt="" />
                        </Link>
                      </div>
                    </td>
                    <td>{order.total_price || "لايوجد سعر"}</td>
                    <td>{order.order_type || "لا يوجد نوع"}</td>
                    <td>{order.id}</td>
                  </motion.tr> // وإغلاق motion.tr هنا
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-center">
            <button
              style={{
                backgroundColor: "rgba(169, 65, 29, 1)",
                color: "white",
              }}
              className="btn mx-2"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              السابق
            </button>
            <span className="align-self-center">
              صفحة {currentPage} من {totalPages}
            </span>
            <button
              className="btn mx-2"
              style={{
                backgroundColor: "rgba(169, 65, 29, 1)",
                color: "white",
              }}
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              التالي
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default NewOrders;
