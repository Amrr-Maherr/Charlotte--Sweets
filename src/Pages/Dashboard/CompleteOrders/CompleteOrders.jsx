import React, { useEffect, useState } from "react";
import "../../../Style/Managers.jsx/Managers.css"; // استخدم نفس الـ CSS
import axios from "axios";
import Loader from "../Loader/Loader";
import eye from "../../../Assets/eye.svg"; // أو أيقونة مناسبة
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function CompleteOrders() {
  const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://management.mlmcosmo.com/api/completed-orders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching completed orders:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // حساب عدد الصفحات
  const totalPages = Math.ceil(Data.length / itemsPerPage);

  // استخراج العناصر للصفحة الحالية
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Data.slice(indexOfFirstItem, indexOfLastItem);

  // التنقل بين الصفحات
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <>
      <section>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="container Managers-table-container vh-100">
              {" "}
              {/* استخدم نفس الـ Class */}
              <div className="row Managers-table-row">
                <div className="col-xl-4 mt-5"></div>
                <div className="col-xl-4 mt-5">
                  {/* يمكنك إضافة حقل بحث هنا إذا كنت بحاجة إليه */}
                </div>
                <div className="col-xl-4 mt-5">
                  <h1 className="Managers-title text-end">الطلبات المكتملة</h1>{" "}
                  {/* عنوان مناسب */}
                </div>
              </div>
              <div className="row Managers-table-row">
                <div className="col-12 Managers-table-col mt-5">
                  <table className="table Managers-table table-hover shadow">
                    {" "}
                    {/* استخدم نفس الـ Classes */}
                    <thead>
                      <tr>
                        <th scope="col">الاجراءات</th>
                        <th scope="col">تاريخ الاكمال</th> {/* مثال لعمود */}
                        <th scope="col">رقم الطلب</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length === 0 ? (
                        <>
                          <tr>
                            <td colSpan="3" className="text-center">
                              لا يوجد طلبات مكتملة حاليا
                            </td>
                          </tr>
                        </>
                      ) : (
                        <>
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
                              <td className="actions">
                                <Link
                                  to={`/dashboard/completed-order-details/${order.id}`} // رابط مناسب
                                  className="action-icon view-icon"
                                >
                                  <div className="action-icon">
                                    <img src={eye} alt="عرض" />
                                  </div>
                                </Link>
                              </td>
                              <td>{order.completion_date || "غير محدد"}</td>{" "}
                              {/* تعديل هنا حسب حقول API */}
                              <td>{order.id}</td>
                            </motion.tr> // وإغلاق motion.tr هنا
                          ))}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Pagination */}
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
          </>
        )}
      </section>
    </>
  );
}

export default CompleteOrders;
