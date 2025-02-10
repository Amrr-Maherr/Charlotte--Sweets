import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../../../Pages/Dashboard/Loader/Loader";
import "../../../Style/ChefsDetails/ChefsDetails.css";
import { motion } from "framer-motion"; // استيراد motion

function ChefsDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [chefData, setChefData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    const fetchChefData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("AuthToken"));
        const response = await axios.get(
          `https://management.mlmcosmo.com/api/chef/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setChefData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching chef data:", error);
        setLoading(false);
      }
    };

    fetchChefData();
  }, [id]);

  if (loading) return <Loader />;

  // حساب عدد الصفحات
  const totalPages = chefData?.orders
    ? Math.ceil(chefData.orders.length / ordersPerPage)
    : 1;

  // استخراج الطلبات للصفحة الحالية
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = chefData?.orders
    ? chefData.orders.slice(indexOfFirstOrder, indexOfLastOrder)
    : [];

  // التنقل بين الصفحات
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <section className="chef-details">
      <div className="container chef-details__container">
        <div className="row chef-details__row">
          <div className="col-12 chef-details__col mt-5"></div>
          <div className="col-12 chef-details__col mt-3 d-flex justify-content-center">
            <motion.div // إضافة motion.div هنا
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="card text-center w-50 shadow"
            >
              <div className="card-title py-3 text-end pe-4">
                <h3>تفاصيل الشيف</h3>
              </div>

              {chefData?.image && (
                <img
                  src={chefData.image}
                  className="card-img-top"
                  alt="شيف"
                  style={{
                    width: "81px",
                    height: "81px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    margin: "0px auto",
                  }}
                />
              )}

              <div className="card-body">
                <table className="table table-bordered text-end">
                  <tbody>
                    <tr>
                      <td>
                        {chefData?.first_name
                          ? `${chefData.first_name} ${chefData.last_name}`
                          : "غير متوفر"}
                      </td>
                      <th>الاسم</th>
                    </tr>
                    <tr>
                      <td>{chefData?.orders ? chefData.orders.length : 0}</td>
                      <th>عدد الطلبات</th>
                    </tr>
                    <tr>
                      <td>
                        {chefData?.branch ? chefData.email : "لا يوجد فرع"}
                      </td>
                      <th>الايميل</th>
                    </tr>
                    <tr>
                      <td>
                        {chefData?.branch
                          ? chefData.branch.phone
                          : "لا يوجد فرع"}
                      </td>
                      <th>رقم الجوال</th>
                    </tr>
                    <tr>
                      <td>
                        {chefData?.branch
                          ? chefData.branch.name
                          : "لا يوجد فرع"}
                      </td>
                      <th>الفرع</th>
                    </tr>
                    <tr>
                      <td>{chefData?.status || "غير متوفر"}</td>
                      <th>الحاله</th>
                    </tr>
                    <tr>
                      <td>{chefData?.verified_at || "غير متوفر"}</td>
                      <th>تاريخ التحقق</th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>{" "}
          </div>

          <div className="col-12 my-4">
            <h3 className="mt-4 text-center">قائمة الطلبات</h3>
            {chefData?.orders && chefData.orders.length > 0 ? (
              <>
                <div className="table-responsive my-4 chef-info-table">
                  <table
                    className="table text-center table-hover"
                    dir="rtl" // تم إضافة الخاصية هنا
                  >
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>نوع الطلب</th>
                        <th>تاريخ الطلب</th>
                        <th>الكمية</th>
                        <th>الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentOrders.map((order, index) => (
                        <tr key={index}>
                          <td>{indexOfFirstOrder + index + 1}</td>
                          <td>{order.order_type || "لا يوجد نوع"}</td>
                          <td>{order.delivery_date || "لا يوجد تاريخ"}</td>
                          <td>{order.quantity || "لا توجد كميه"}</td>
                          <td>{order.status || "لا توجد حاله"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
              </>
            ) : (
              <p className="text-center text-muted">لا توجد طلبات.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ChefsDetails;
