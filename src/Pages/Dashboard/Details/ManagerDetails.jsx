import { useEffect, useState } from "react";
import "../../../Style/Details/Details.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader/Loader";
import { motion } from "framer-motion"; // استيراد motion

function Details() {
  const [Manager, setManager] = useState({});
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`https://management.mlmcosmo.com/api/manager/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setManager(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [token, id]);

  return (
    <>
      <section>
        {loading ? (
          <Loader />
        ) : (
          <motion.div // إضافة motion.div هنا
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="container Details-container">
              <div className="row Details-row">
                <div className="col-12 Details-col">
                  <div className="card text-center">
                    <div className="card-title">
                      <h3>تفاصيل المدير</h3>
                    </div>
                    {Manager.image && (
                      <img
                        src={Manager.image}
                        className="card-img-top"
                        alt="مدير"
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
                              {Manager.first_name
                                ? `${Manager.first_name} ${Manager.last_name}`
                                : "غير متوفر"}
                            </td>
                            <th>الاسم</th>
                          </tr>
                          <tr>
                            <td>
                              {Manager.branch
                                ? Manager.branch.name
                                : "لا يوجد فرع"}
                            </td>
                            <th>الفرع</th>
                          </tr>
                          <tr>
                            <td>{Manager.email || "غير متوفر"}</td>
                            <th>البريد الإلكتروني</th>
                          </tr>
                          <tr>
                            <td>{Manager.phone || "غير متوفر"}</td>
                            <th>رقم الهاتف</th>
                          </tr>
                          <tr>
                            <td>{Manager.status || "غير متوفر"}</td>
                            <th>حالة الطلب</th>
                          </tr>
                          <tr>
                            <td>{Manager.verified_at || "غير متوفر"}</td>
                            <th>تاريخ الإضافة</th>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div> // إغلاق motion.div هنا
        )}
      </section>
    </>
  );
}

export default Details;
