import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../../Loader/Loader";
import { motion } from "framer-motion";
import "../../../../Style/BranchDetails/BranchDetails.css";

function BranchDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://management.mlmcosmo.com/api/branches/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching branch details:", error);
        console.log("Error Response Data:", error.response?.data);
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  if (loading) {
    return <Loader />;
  }

  if (!data) {
    return <p>لم يتم العثور على بيانات للفرع بالمعرف: {id}</p>;
  }

  return (
    <section className="branch-details-section py-5">
      <div className="container">
        <div className="row">
          {/* عرض الخريطة */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="col-md-6 mb-4"
          >
            <h3 className="card-title mb-3 text-end">الخريطة</h3>
            <div className="card shadow-lg">
              <div className="card-body map-card">
                <iframe
                  src={`https://www.google.com/maps?q=${data.lat},${data.long}&hl=ar&z=13&output=embed`}
                  width="100%"
                  height="400px"
                  frameBorder="0"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  aria-hidden="false"
                  tabIndex="0"
                ></iframe>
              </div>
            </div>
          </motion.div>

          {/* تفاصيل الفرع */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="col-md-6 mb-4"
          >
            <h3 className="card-title mb-3 text-end">تفاصيل الفرع</h3>
            <div className="card shadow-lg branch-card">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-end w-100 text-end mt-3">
                  <div className="branch-info">
                    <p className="branch-name" style={{ width: "400px" }}>
                      {data.name}
                    </p>
                    <p className="branch-address" style={{ width: "400px" }}>
                      {data.address}
                    </p>
                    {data.manager ? (
                      <p className="branch-manager" style={{ width: "400px" }}>
                        {data.manager.first_name} {data.manager.last_name}
                      </p>
                    ) : (
                      <p className="branch-manager" style={{ width: "400px" }}>
                        لا يوجد مدير
                      </p>
                    )}
                    <p className="branch-phone" style={{ width: "400px" }}>
                      {data.phone}
                    </p>
                  </div>
                  <div className="branch-labels">
                    <p className="label">اسم الفرع</p>
                    <p className="label">عنوانه</p>
                    <p className="label">مدير الفرع</p>
                    <p className="label">رقم الجوال</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* الشيفات */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="col-12 chefs-list my-5"
          >
            <div className="chefs-container">
              <div className="chefs-grid container">
                <h3 className="chefs-title text-end">الشيفات</h3>
                <div className="row gy-4">
                  {data.chefs && data.chefs.length > 0 ? (
                    data.chefs.map((chef, index) => (
                      <div
                        key={index}
                        className="col-xl-3 col-md-6 col-12 ms-auto chef-col"
                      >
                        <div className="card chef-card shadow">
                          <div className="chef-info">
                            <p className="chef-name">
                              {chef.first_name} {chef.last_name}
                            </p>
                            <p className="chef-bio">{chef.bio}</p>
                          </div>
                          <div className="chef-image">
                            <img src={chef.image} alt="" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-end">لا يوجد شيفات لهذا الفرع.</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* مناديب المبيعات */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="col-12 sales"
          >
            <div className="container">
              <div className="row gy-4">
                <h3 className="delivery-title text-end">مناديب المبيعات</h3>
                {data.deliveries && data.deliveries.length > 0 ? (
                  data.deliveries.map((delivery, index) => (
                    <div
                      key={index}
                      className="col-xl-3 col-md-6 col-12 ms-auto delivery-col"
                    >
                      <div className="card delivery-card shadow">
                        <div className="delivery-info">
                          <p className="delivery-name">
                            {delivery.first_name} {delivery.last_name}
                          </p>
                        </div>
                        <div className="delivery-image">
                          <img src={delivery.image} alt={delivery.first_name} />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-end">لا يوجد مناديب مبيعات لهذا الفرع.</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default BranchDetails;
