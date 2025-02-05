import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../../../Pages/Dashboard/Loader/Loader"
import "../../../Style/ChefsDetails/ChefsDetails.css"
function ChefsDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [chefData, setChefData] = useState(null);

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

  return (
    <>
      <section className="chef-details">
        {" "}
        {/* كلاس للقسم الرئيسي */}
        {loading ? (
          <><Loader/></>
        ) : (
          <>
            <div className="container chef-details__container">
              {" "}
              {/* كلاس للحاوية */}
              <div className="row chef-details__row">
                {" "}
                {/* كلاس للصف */}
                <div className="col-12 chef-details__col mt-5">
                  {" "}
                  {/* كلاس للعمود */}
                  <h1 className="chef-details__title">قائمة الطلبات</h1>{" "}
                  {/* كلاس للعنوان */}
                </div>
                <div className="col-12 chef-details__col mt-3">
                  {" "}
                  {/* كلاس للعمود */}
                  <table className="table table-hover text-center chef-details__table">
                    {" "}
                    {/* كلاس للجدول */}
                    <thead>
                      <tr className="chef-details__table-header">
                        {" "}
                        {/* كلاس لصف الرأس */}
                        <th
                          scope="col"
                          className="chef-details__table-header-cell"
                        >
                          حالة الطلب
                        </th>{" "}
                        {/* كلاس لخلية الرأس */}
                        <th
                          scope="col"
                          className="chef-details__table-header-cell"
                        >
                          الطلب
                        </th>{" "}
                        {/* كلاس لخلية الرأس */}
                        <th
                          scope="col"
                          className="chef-details__table-header-cell"
                        >
                          تاريخ الطلب
                        </th>{" "}
                        {/* كلاس لخلية الرأس */}
                        <th
                          scope="col"
                          className="chef-details__table-header-cell"
                        >
                          اسم الزبون
                        </th>{" "}
                        {/* كلاس لخلية الرأس */}
                        <th
                          scope="col"
                          className="chef-details__table-header-cell"
                        >
                          رقم الطلب
                        </th>{" "}
                        {/* كلاس لخلية الرأس */}
                      </tr>
                    </thead>
                    <tbody>
                      {chefData.orders.length > 0 ? (
                        chefData.orders.map((order) => (
                          <tr
                            key={order.id}
                            className="chef-details__table-row"
                          >
                            {" "}
                            {/* كلاس لصف البيانات */}
                            <td className="chef-details__table-cell">
                              {order.status || "غير متوفر"}
                            </td>{" "}
                            {/* كلاس لخلية البيانات */}
                            <td className="chef-details__table-cell">
                              {order.order_details || "غير متوفر"}
                            </td>{" "}
                            {/* كلاس لخلية البيانات */}
                            <td className="chef-details__table-cell">
                              {order.delivery_date || "غير متوفر"}
                            </td>{" "}
                            {/* كلاس لخلية البيانات */}
                            <td className="chef-details__table-cell">
                              {order.customer_name || "غير متوفر"}
                            </td>{" "}
                            {/* كلاس لخلية البيانات */}
                            <td className="chef-details__table-cell">
                              {order.id}
                            </td>{" "}
                            {/* كلاس لخلية البيانات */}
                          </tr>
                        ))
                      ) : (
                        <tr className="chef-details__table-row">
                          {" "}
                          {/* كلاس لصف البيانات */}
                          <td colSpan="5" className="chef-details__table-cell">
                            لا يوجد طلبات
                          </td>{" "}
                          {/* كلاس لخلية البيانات */}
                        </tr>
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

export default ChefsDetails;
