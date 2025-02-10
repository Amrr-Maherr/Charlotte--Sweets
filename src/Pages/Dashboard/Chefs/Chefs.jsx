import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import Loader from "../Loader/Loader";
import "../../../Style/Chefs/Chefs.css";
import see from "../../../Assets/eye.svg";
import del from "../../../Assets/deleteButton.svg";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion"; // استيراد motion

function Chefs() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");

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
          .delete(`https://management.mlmcosmo.com/api/delete-chef/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            Swal.fire(
              "تم الحذف!",
              response.data, // عرض رسالة النجاح من الـ API
              "success"
            );
            setData((prevData) => prevData.filter((chef) => chef.id !== id)); // تحديث الـ State بعد الحذف
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

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://management.mlmcosmo.com/api/chefs",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(true);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // تصفية بيانات الشيفات بناءً على كلمة البحث
  const filteredChefs = data.filter((chef) => {
    const fullName = `${chef.first_name} ${chef.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  // حساب عدد الصفحات بعد التصفية
  const totalPagesFiltered = Math.ceil(filteredChefs.length / itemsPerPage);

  // استخراج العناصر للصفحة الحالية بعد التصفية
  const indexOfLastItemFiltered = currentPage * itemsPerPage;
  const indexOfFirstItemFiltered = indexOfLastItemFiltered - itemsPerPage;
  const currentItemsFiltered = filteredChefs.slice(
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
            {/* استخدم fragment هنا */}
            <div className="container chef-container">
              <div className="row chef-row">
                <div className="col-xl-4 mt-5"></div>
                <div className="col-xl-4 mt-5">
                  <input
                    type="text"
                    className="form-control p-2 rounded text-end"
                    placeholder="ابحث باسم الشيف..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-xl-4 mt-5">
                  <h1 className="chef-title text-end">الشيفات</h1>
                </div>
              </div>
              <div className="row chef-row">
                <div className="col-12 chef-col mt-5">
                  <table className="table chef-table table-hover shadow">
                    <thead>
                      <tr>
                        <th scope="col">الاجرائات</th>
                        <th scope="col">الفرع</th>
                        <th scope="col">عدد الطلبات</th>
                        <th scope="col">الاسم</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItemsFiltered.length === 0 ? (
                        <>
                          <tr>
                            <td colSpan="4" className="chef-no-data">
                              لا يوجد شيفات متاحة
                            </td>
                          </tr>
                        </>
                      ) : (
                        <>
                          {/* واستخدم fragment هنا */}
                          {currentItemsFiltered.map((chef, index) => (
                            <motion.tr // استخدام motion.tr هنا
                              initial={{ opacity: 0, y: 50 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 100,
                                damping: 25,
                                delay: 0.1 * index,
                              }} // حركة Bounce مع تأخير حسب ترتيب الصف
                              key={chef.id}
                            >
                              <td className="actions">
                                <div
                                  className="delete-icon"
                                  onClick={() => handleDelete(chef.id)}
                                >
                                  <img src={del} alt="حذف" />
                                </div>
                                <Link to={`/dashboard/chef-details/${chef.id}`}>
                                  <div className="seeIcon">
                                    <img src={see} alt="عرض" />
                                  </div>
                                </Link>
                              </td>
                              <td className="chef-branch">
                                {chef.branch.name}
                              </td>
                              <td className="chef-phone">
                                {chef.orders_count}
                              </td>
                              <td className="chef-name">
                                {chef.first_name} {chef.last_name}
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

export default Chefs;
