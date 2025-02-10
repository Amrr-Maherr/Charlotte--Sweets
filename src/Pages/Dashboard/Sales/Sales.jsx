import React, { useState, useEffect, useCallback } from "react";
import "../../../Style/Sales/Sales.css";
import axios from "axios";
import { Link } from "react-router-dom";
import eye from "../../../Assets/eye.svg";
import Loader from "../Loader/Loader";
import { motion } from "framer-motion";
import DeleteIcon from "../../../Assets/deleteButton.svg";
import Swal from "sweetalert2";

function Sales() {
  const [Data, seData] = useState([]);
  const [loading, setloading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState(""); // State الخاص بالبحث

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://management.mlmcosmo.com/api/sales",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        seData(response.data);
        setloading(false);
      } catch (error) {
        setloading(true);
      }
    };

    fetchData();
  }, [token]);

  // فنكشن الحذف
  const handleDelete = async (id) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن يمكنك التراجع عن هذا!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذف!",
      cancelButtonText: "إلغاء",
    }).then(async (result) => {
      // استخدام async/await
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `https://management.mlmcosmo.com/api/delete-sale/${id}`, // تعديل الـ Endpoint
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          Swal.fire("تم الحذف!", response.data, "success");
          seData((prevData) => prevData.filter((sale) => sale.id !== id));
        } catch (error) {
          Swal.fire(
            "خطأ!",
            error.response?.data?.message || "حدث خطأ أثناء الحذف.",
            "error"
          );
        }
      }
    });
  };

  // تصفية بيانات المبيعات بناءً على كلمة البحث
  const filteredSales = Data.filter((sale) => {
    const fullName = `${sale.first_name} ${sale.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  // حساب عدد الصفحات بعد التصفية
  const totalPagesFiltered = Math.ceil(filteredSales.length / itemsPerPage);

  // استخراج العناصر للصفحة الحالية بعد التصفية
  const indexOfLastItemFiltered = currentPage * itemsPerPage;
  const indexOfFirstItemFiltered = indexOfLastItemFiltered - itemsPerPage;
  const currentItemsFiltered = filteredSales.slice(
    indexOfFirstItemFiltered,
    indexOfLastItemFiltered
  );

  // التنقل بين الصفحات
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPagesFiltered));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <>
      <section>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="container Sales-table-container">
              <div className="row">
                <div className="col-xl-4 mt-5"></div>
                <div className="col-xl-4 mt-5">
                  <input
                    type="text"
                    className="form-control p-2 rounded text-end"
                    placeholder="ابحث باسم مندوب المبيعات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-xl-4 mt-5">
                  <h2 className="Sales-table-title text-end">قائمة المبيعات</h2>
                </div>
              </div>
              <div className="row Sales-table-row">
                <div className="col-12 Sales-table-col mt-5">
                  <table className="table Sales-table table-hover shadow">
                    <thead>
                      <tr>
                        <th scope="col">الاجرائات</th>
                        <th scope="col">البريد الالكتروني</th>
                        <th scope="col">الجوال</th>
                        <th scope="col">الاسم</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItemsFiltered.length === 0 ? (
                        <>
                          <tr>
                            <td colSpan="4" className="text-center">
                              لا يوجد سيلز حاليا
                            </td>
                          </tr>
                        </>
                      ) : (
                        <>
                          {currentItemsFiltered.map((sale, index) => (
                            <motion.tr
                              initial={{ opacity: 0, y: 50 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 100,
                                damping: 25,
                                delay: 0.1 * index,
                              }}
                              key={sale.id}
                            >
                              <td className="actions">
                                <div
                                  className="action-icon delete-icon"
                                  onClick={() => handleDelete(sale.id)}
                                >
                                  <img src={DeleteIcon} alt="حذف" />
                                </div>
                                <Link
                                  to={`/dashboard/sales-details/${sale.id}`}
                                  className="action-icon view-icon"
                                >
                                  <div className="action-icon">
                                    <img src={eye} alt="" />
                                  </div>
                                </Link>
                              </td>
                              <td>{sale.email}</td>
                              <td>{sale.phone}</td>
                              <td>
                                {sale.first_name} {sale.last_name}
                              </td>
                            </motion.tr>
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
                  صفحة {currentPage} من {totalPagesFiltered}
                </span>
                <button
                  className="btn mx-2"
                  style={{
                    backgroundColor: "rgba(169, 65, 29, 1)",
                    color: "white",
                  }}
                  onClick={nextPage}
                  disabled={currentPage === totalPagesFiltered}
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

export default Sales;
