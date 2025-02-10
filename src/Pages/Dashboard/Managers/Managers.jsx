import React, { useEffect, useState, useCallback } from "react";
import "../../../Style/Managers.jsx/Managers.css";
import axios from "axios";
import Loader from "../Loader/Loader";
import deleteIcon from "../../../Assets/deleteButton.svg";
import eye from "../../../Assets/eye.svg";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Swal from "sweetalert2"; // استيراد SweetAlert2
import { motion } from "framer-motion"; // استيراد motion

function Managers() {
  const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState(""); // State الخاص بالبحث

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://management.mlmcosmo.com/api/managers",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error.response.data.message);
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

  const handleDelete = (id) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن يمكنك التراجع عن هذا!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذف!",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://management.mlmcosmo.com/api/delete-manager/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            Swal.fire(
              "تم الحذف!",
              response.data, // عرض رسالة النجاح من الـ API
              "success"
            );
            setData((prevData) =>
              prevData.filter((manager) => manager.id !== id)
            ); // تحديث الـ State بعد الحذف
          })
          .catch((error) => {
            Swal.fire(
              "خطأ!",
              error.response?.data?.message || "حدث خطأ أثناء الحذف.", // عرض رسالة الخطأ من الـ API أو رسالة عامة
              "error"
            );
          });
      }
    });
  };

  // تصفية بيانات المديرين بناءً على كلمة البحث
  const filteredManagers = Data.filter((manager) => {
    const fullName = `${manager.first_name} ${manager.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  // حساب عدد الصفحات بعد التصفية
  const totalPagesFiltered = Math.ceil(filteredManagers.length / itemsPerPage);

  // استخراج العناصر للصفحة الحالية بعد التصفية
  const indexOfLastItemFiltered = currentPage * itemsPerPage;
  const indexOfFirstItemFiltered = indexOfLastItemFiltered - itemsPerPage;
  const currentItemsFiltered = filteredManagers.slice(
    indexOfFirstItemFiltered,
    indexOfLastItemFiltered
  );

  return (
    <>
      <section>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="container Managers-table-container vh-100">
              <div className="row Managers-table-row">
                <div className="col-xl-4 mt-5"></div>
                <div className="col-xl-4 mt-5">
                  <input
                    type="text"
                    className="form-control p-2 rounded text-end"
                    placeholder="ابحث باسم المدير..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-xl-4 mt-5">
                  <h1 className="Managers-title text-end">المديرين</h1>
                </div>
              </div>
              <div className="row Managers-table-row">
                <div className="col-12 Managers-table-col mt-5">
                  <table className="table Managers-table table-hover shadow">
                    <thead>
                      <tr>
                        <th scope="col">الاجراءات</th>
                        <th scope="col">الفرع</th>
                        <th scope="col">الاسم</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItemsFiltered.length === 0 ? (
                        <>
                          <tr>
                            <td colSpan="3" className="text-center">
                              لا يوجد مديرين حاليا
                            </td>
                          </tr>
                        </>
                      ) : (
                        <>
                          {currentItemsFiltered.map((manager, index) => (
                            <motion.tr // استخدام motion.tr هنا
                              initial={{ opacity: 0, y: 50 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 100,
                                damping: 25,
                                delay: 0.1 * index,
                              }} // حركة Bounce مع تأخير حسب ترتيب الصف
                              key={manager.id}
                            >
                              <td className="actions">
                                <motion.div
                                  onClick={() => {
                                    handleDelete(manager.id);
                                  }}
                                  whileHover={{ scale: 1.3 }}
                                  whileTap={{ scale: 0.8 }}
                                  className="action-icon delete-icon"
                                >
                                  <img src={deleteIcon} alt="حذف" />
                                </motion.div>
                                <Link
                                  to={`/dashboard/manager-details/${manager.id}`}
                                  className="action-icon view-icon"
                                >
                                  <div className="action-icon">
                                    <img src={eye} alt="عرض" />
                                  </div>
                                </Link>
                              </td>
                              <td>{manager.branch.name}</td>
                              <td>
                                {manager.first_name} {manager.last_name}
                              </td>
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
      <Toaster />
    </>
  );
}
export default Managers;
