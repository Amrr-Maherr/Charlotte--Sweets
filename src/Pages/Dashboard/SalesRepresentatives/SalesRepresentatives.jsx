import React, { useEffect, useState, useCallback } from "react";
import "../../../Style/SalesRepresentatives/SalesRepresentatives.css";
import Loader from "../../../Pages/Dashboard/Loader/Loader";
import axios from "axios";
import Delete from "../../../Assets/deleteButton.svg";
import Eye from "../../../Assets/eye.svg";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // استيراد motion
import Swal from "sweetalert2"; // استيراد SweetAlert2

function SalesRepresentatives() {
  const [Data, setData] = useState([]);
  const [Loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState(""); // State الخاص بالبحث

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://management.mlmcosmo.com/api/deliveries",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error.response?.data?.message || "An error occurred");
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

  // فنكشن الحذف مع SweetAlert2
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
          .delete(`https://management.mlmcosmo.com/api/delete-delivery/${id}`, {
            // تم تحديث الـ Endpoint هنا
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            Swal.fire("تم الحذف!", "تم حذف مندوب التوصيل بنجاح.", "success");
            setData((prevData) => prevData.filter((rep) => rep.id !== id)); // تحديث الـ State بعد الحذف
          })
          .catch((error) => {
            Swal.fire(
              "خطأ!",
              error.response?.data?.message || "حدث خطأ أثناء الحذف.",
              "error"
            );
          });
      }
    });
  };

  // تصفية بيانات مندوبي المبيعات بناءً على كلمة البحث
  const filteredSalesReps = Data.filter((rep) => {
    const fullName = `${rep.first_name} ${rep.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  // حساب عدد الصفحات بعد التصفية
  const totalPagesFiltered = Math.ceil(filteredSalesReps.length / itemsPerPage);

  // استخراج العناصر للصفحة الحالية بعد التصفية
  const indexOfLastItemFiltered = currentPage * itemsPerPage;
  const indexOfFirstItemFiltered = indexOfLastItemFiltered - itemsPerPage;
  const currentItemsFiltered = filteredSalesReps.slice(
    indexOfFirstItemFiltered,
    indexOfLastItemFiltered
  );

  return (
    <section className="sales-representatives-section">
      {Loading ? (
        <Loader />
      ) : (
        <div className="container sales-reps-table-container">
          <div className="row sales-reps-table-row">
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
              <h1 className="sales-representatives-title text-end">
                قائمة توصيل الطلبات
              </h1>
            </div>
          </div>
          <div className="row sales-reps-table-row">
            <div className="col-12 sales-reps-table-col mt-5">
              <table className="table sales-reps-table  table-hover shadow">
                <thead>
                  <tr>
                    <th scope="col">الاجراءات</th>
                    <th scope="col">الفرع</th>
                    <th scope="col">عدد الطلبات</th>
                    <th scope="col">الاسم</th>
                    <th scope="col">#</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItemsFiltered.map((rep, index) => (
                    <motion.tr // استخدام motion.tr هنا
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 25,
                        delay: 0.1 * index,
                      }}
                      key={rep.id}
                      className="sales-reps-table-row"
                    >
                      <td>
                        <div className="actions">
                          <img
                            src={Delete}
                            alt="حذف"
                            onClick={() => handleDelete(rep.id)} // قم بتوصيل فنكشن الحذف هنا
                          />
                          <Link
                            to={`/dashboard/sales-representatives-details/${rep.id}`}
                            style={{ textDecoration: "none" }}
                          >
                            <img src={Eye} alt="" />
                          </Link>
                        </div>
                      </td>
                      <td>{rep.branch.name}</td>
                      <td>{rep.orders_count}</td>
                      <td>
                        {rep.first_name} {rep.last_name}
                      </td>
                      <td>{indexOfFirstItem + index + 1}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* أزرار التنقل بين الصفحات */}
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
      )}
    </section>
  );
}

export default SalesRepresentatives;
