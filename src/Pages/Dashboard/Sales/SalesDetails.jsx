import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader/Loader";
import "../../../Style/ChefsDetails/ChefsDetails.css";
import { motion } from "framer-motion"; // استيراد motion

function SalesDetails() {
  const { id } = useParams();
  const [Data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    axios
      .get(`https://management.mlmcosmo.com/api/sale/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response.data);
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [id, token]);

  if (loading) return <Loader />;

  // حساب عدد الصفحات
  const totalPages = Data?.orders
    ? Math.ceil(Data.orders.length / ordersPerPage)
    : 1;

  // استخراج الطلبات للصفحة الحالية
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = Data?.orders
    ? Data.orders.slice(indexOfFirstOrder, indexOfLastOrder)
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
                <h3>تفاصيل السيلز</h3>
              </div>

              {Data?.image && (
                <img
                  src={Data.image}
                  className="card-img-top"
                  alt="Delivery Person"
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
                        {Data?.first_name
                          ? `${Data.first_name} ${Data.last_name}`
                          : "غير متوفر"}
                      </td>
                      <th>الاسم</th>
                    </tr>
                    <tr>
                      <td>{Data?.orders ? Data.orders.length : 0}</td>
                      <th>عدد الطلبات</th>
                    </tr>
                    <tr>
                      <td>{Data?.email ? Data.email : "غير متوفر"}</td>
                      <th>الايميل</th>
                    </tr>
                    <tr>
                      <td>{Data?.phone ? Data.phone : "غير متوفر"}</td>
                      <th>رقم الجوال</th>
                    </tr>
                    <tr>
                      <td>{Data?.status || "غير متوفر"}</td>
                      <th>الحاله</th>
                    </tr>
                    <tr>
                      <td>{Data?.verified_at || "غير متوفر"}</td>
                      <th>تاريخ التحقق</th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>{" "}
            
          </div>

          <div className="col-12 my-4">
            <h3 className="mt-4 text-center">قائمة الطلبات</h3>
            {Data?.orders && Data.orders.length > 0 ? (
              <>
                <div className="table-responsive my-4 chef-info-table">
                  <table className="table text-center table-hover" dir="rtl">
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
                    style={{
                      backgroundColor: "rgba(169, 65, 29, 1)",
                      color: "white",
                    }}
                    className="btn mx-2"
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

export default SalesDetails;
