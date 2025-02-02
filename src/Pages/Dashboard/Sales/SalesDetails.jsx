import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import { motion } from "framer-motion";
function SalesDetails() {
  const { id } = useParams();
  const [Data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));

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
        setLoading(true);
      });
  }, [id, token]);

  return (
    <>
      <section>
        {loading ? (
          <Loader />
        ) : (
          <div className="container Sales-table-container">
            <div className="row Sales-table-row mt-4">
              <div className="col-12 Sales-table-title-col">
                <h2 className="Sales-table-title">قائمة المبيعات</h2>
              </div>
              <div className="col-12 Sales-table-col">
                <table className="table Sales-table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">قيمه الطلب</th>
                      <th scope="col">الفرع</th>
                      <th scope="col">تاريخ الطلب</th>
                      <th scope="col">الاسم</th>
                      <th scope="col">رقم الطلب</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(Data).length === 0 || !Data.orders ? (
                      <tr>
                        <td colSpan="5">لا توجد طلبات حاليه</td>
                      </tr>
                    ) : (
                      Data.orders.map((order, index) => (
                        <motion.tr
                          initial={{ translateX: "-100vw" }}
                          animate={{ translateX: "0" }}
                          key={index}
                        >
                          <td>{order.total_price || 0}</td>
                          <td>{order.map_desc}</td>
                          <td>{Data.created_at.slice(0, 10)}</td>
                          <td>{order.customer_name}</td>
                          <td>{Data.id}</td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default SalesDetails;
