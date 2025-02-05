import { useEffect, useState } from "react";
import "../../../Style/Sales/Sales.css";
import axios from "axios";
import { Link } from "react-router-dom";
import eye from "../../../Assets/eye.svg";
import Loader from "../Loader/Loader";
import { motion } from "framer-motion";
function Sales() {
  const [Data, seData] = useState([])
  const [loading,setloading] = useState(true)
  const token = JSON.parse(localStorage.getItem('AuthToken'))
  useEffect(() => {
    axios
      .get("https://management.mlmcosmo.com/api/sales",{headers:{Authorization:`Bearer ${token}`}})
      .then((response) => {
        seData(response.data)
        setloading(false)

      })
      .catch((error) => {
        setloading(true)
      });
  },[token])
  return (
    <>
      <section>
        {loading ? (
          <>
            <Loader />
          </>
        ) : (
          <>
            <div className="container Sales-table-container">
              <div className="row Sales-table-row">
                <div className="col-12 Sales-table-title-col mt-5">
                  <h2 className="Sales-table-title">قائمة المبيعات</h2>
                </div>
                <div className="col-12 Sales-table-col mt-3">
                  <table className="table Sales-table table-hover">
                    <thead>
                      <tr>
                        <th scope="col">الاجرائات</th>
                        <th scope="col">البريد الالكتروني</th>
                        <th scope="col">الجوال</th>
                        <th scope="col">الاسم</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Data.length === 0 ? (
                        <>
                          <tr>
                            <td colSpan="3">لا يوجد سيلز حاليا</td>
                          </tr>
                        </>
                      ) : (
                        <>
                          {Data.map((sale) => (
                            <motion.tr
                              initial={{ translateX: "-100vw" }}
                              animate={{ translateX: "0" }}
                              key={sale.id}
                            >
                              <td className="actions">
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
                                {sale.first_name}
                                {""}
                                {sale.first_name}
                              </td>
                            </motion.tr>
                          ))}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}

export default Sales;
