import { useEffect, useState } from "react";
import "../../Style/StatisticsList/StatisticsList.css";
import axios from "axios";

function StatisticsList() {
  const [statistics, setStatistics] = useState({
    branches: 0,
    managers: 0,
    sales: 0,
    orders: 0,
    chefs: 0,
    deliveries: 0,
  });
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://management.mlmcosmo.com/api/stats",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStatistics(response.data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
        console.error("Error message:", error.response?.data?.message);
      }
    };

    if (token) {
      fetchData();
    } else {
      console.warn(
        "No AuthToken found in localStorage. Statistics will not be fetched."
      );
    }
  }, [token]);

  return (
    <>
      <div style={{ width: "320px" }}>
        <h3 className="text-end" style={{fontSize:'20px',fontWeight:"700",fontFamily:'cairo'}}>الاحصائيات</h3>
      </div>
      <div className="parent mx-auto shadow">
        <div className="sub-parent">
          <div className="info">
            <div className="sub-info">
              <p className="info-number p-0">{statistics.branches}</p>
              <h4 className="info-title p-0">فرع</h4>
            </div>
            <div className="icon">
              <i className="fa fa-building"></i> {/* Branch Icon */}
            </div>
          </div>
        </div>
        <div className="sub-parent">
          <div className="info">
            <div className="sub-info">
              <p className="info-number p-0">{statistics.managers}</p>
              <h4 className="info-title p-0">مدير</h4>
            </div>
            <div className="icon">
              <i className="fa fa-user"></i>{" "}
              {/* Manager Icon (closest available in 4.7.0) */}
            </div>
          </div>
        </div>
        <div className="sub-parent">
          <div className="info">
            <div className="sub-info">
              <p className="info-number p-0">{statistics.chefs}</p>
              <h4 className="info-title p-0">شيف</h4>
            </div>
            <div className="icon">
              <i className="fa fa-cutlery"></i> {/* Chef Icon */}
            </div>
          </div>
        </div>
        <div className="sub-parent">
          <div className="info">
            <div className="sub-info">
              <p className="info-number p-0">{statistics.sales}</p>
              <h4 className="info-title p-0">سيلز</h4>
            </div>
            <div className="icon">
              <i className="fa fa-line-chart"></i> {/* Sales Icon */}
            </div>
          </div>
        </div>
        <div className="sub-parent">
          <div className="info">
            <div className="sub-info">
              <p className="info-number p-0">{statistics.deliveries}</p>
              <h4 className="info-title p-0">مندوب</h4>
            </div>
            <div className="icon">
              <i className="fa fa-truck"></i> {/* Delivery Icon */}
            </div>
          </div>
        </div>
        <div className="sub-parent">
          <div className="info">
            <div className="sub-info">
              <p className="info-number p-0">{statistics.orders}</p>
              <h4 className="info-title p-0">الاوردرات الكليه</h4>
            </div>
            <div className="icon">
              <i className="fa fa-shopping-cart"></i> {/* Orders Icon */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StatisticsList;
