import React, { useEffect, useState } from "react";
import "../../../Style/SalesRepresentatives/SalesRepresentatives.css"
import Loader  from "../../../Pages/Dashboard/Loader/Loader"
import axios from "axios";
function SalesRepresentatives() {
  const [Data, setData] = useState([])
  const [Loading, setLoading] = useState(true)
  const token = JSON.parse(localStorage.getItem("AuthToken"))
  useEffect(() => {
    axios
      .get("https://management.mlmcosmo.com/api/deliveries",{headers:{Authorization:`Bearer ${token}`}})
      .then((response) => {
        console.log(response.data);
        setData(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.log(error.response.data.message);
        setLoading(true)
      });
  },[token])
  return (
    <>
      <section className="sales-representatives-section">
        {Loading ? (
          <>
          <Loader/>
          </>
        ) : (
          <>
            <div className="container sales-reps-table-container">
              <div className="row sales-reps-table-row">
                <div className="col-12 mt-5">
                  <h1 className="sales-representatives-title">
                    قائمه توصيل الطلبات
                  </h1>
                </div>
                <div className="col-12 sales-reps-table-col mt-3">
                  <table className="table sales-reps-table  table-hover">
                    <thead>
                      <tr>
                        <th scope="col">الفرع</th>
                        <th scope="col">عدد الطلب</th>
                        <th scope="col">تاريخ الطلب</th>
                        <th scope="col">الاسم</th>
                        <th scope="col">رقم الطلب</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Data.map((rep) => (
                        <tr key={rep.id} className="sales-reps-table-row">
                          <th scope="row">{rep.branch.name}</th>
                          <th scope="row">{rep.orders_count}</th>
                          <th scope="row">
                            {rep.branch.created_at.slice(0, 10)}
                          </th>
                          <th scope="row">
                            {rep.first_name} {rep.last_name}
                          </th>
                          <th scope="row">{rep.id}</th>
                        </tr>
                      ))}
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

export default SalesRepresentatives;
