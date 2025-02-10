import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../../Pages/Dashboard/Loader/Loader";
import "../../../Style/Details/Details.css"; // استيراد الـ CSS
import { motion } from "framer-motion"; // استيراد motion

function SalesRepresentativesDetails() {
  const { id } = useParams();
  const [Data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://management.mlmcosmo.com/api/delivery/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error.response?.data);
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  if (loading) {
    return <Loader />;
  }

  return (
    <section>
      <div className="container Details-container">
        {" "}
        {/* استخدام الـ Container */}
        <div className="row Details-row">
          {" "}
          {/* استخدام الـ Row */}
          <div className="col-12 Details-col">
            <motion.div // إضافة motion.div هنا
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="card text-end shadow "
              dir="rtl"
            >
              {" "}
              {/* استخدام الـ Card */}
              <div className="card-title">
                <h3>تفاصيل مندوب التوصيل</h3>
              </div>
              {Data.image && (
                <img
                  src={Data.image}
                  className="card-img-top"
                  alt="مندوب التوصيل"
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
                      <th>الاسم</th>
                      <td>
                        {Data.first_name
                          ? `${Data.first_name} ${Data.last_name}`
                          : "غير متوفر"}
                      </td>
                    </tr>
                    <tr>
                      <th>الفرع</th>
                      <td>{Data.branch ? Data.branch.name : "لا يوجد فرع"}</td>
                    </tr>
                    <tr>
                      <th>البريد الإلكتروني</th>
                      <td>{Data.email || "غير متوفر"}</td>
                    </tr>
                    <tr>
                      <th>رقم الهاتف</th>
                      <td>{Data.phone || "غير متوفر"}</td>
                    </tr>
                    <tr>
                      <th>حالة الطلب</th>
                      <td>{Data.status || "غير متوفر"}</td>
                    </tr>
                    <tr>
                      <th>تاريخ الإضافة</th>
                      <td>{Data.verified_at || "غير متوفر"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>{" "}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SalesRepresentativesDetails;
