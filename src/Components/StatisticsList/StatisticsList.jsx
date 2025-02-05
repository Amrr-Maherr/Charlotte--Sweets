import { useEffect, useState } from "react";
import "../../Style/StatisticsList/StatisticsList.css";
import axios from "axios";

function StatisticsList() {
  const [Data, setData] = useState([]);
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  useEffect(() => {
    axios
      .get("https://management.mlmcosmo.com/api/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  }, [token]);

  return (
    <div>
      <div className="StatisticsList-title">
        <h3>الاحصائيات</h3>
        <div className="StatisticsList shadow-sm">
          <div className="StatisticsList-main">
            <div className="StatisticsList-info">
              <p className="StatisticsList-number">{Data.branches}</p>
              <p className="StatisticsList-name">فرع</p>
            </div>
            <div className="StatisticsList-icon">
              <i className="fa fa-building"></i> {/* أيقونة الفرع */}
            </div>
          </div>
          <div className="StatisticsList-main">
            <div className="StatisticsList-info">
              <p className="StatisticsList-number">{Data.managers}</p>
              <p className="StatisticsList-name">مدير</p>
            </div>
            <div className="StatisticsList-icon">
              <i className="fa fa-user"></i> {/* بديلة لأيقونة المدير */}
            </div>
          </div>
          <div className="StatisticsList-main">
            <div className="StatisticsList-info">
              <p className="StatisticsList-number">{Data.sales}</p>
              <p className="StatisticsList-name">سيلز</p>
            </div>
            <div className="StatisticsList-icon">
              <i className="fa fa-line-chart"></i> {/* أيقونة السيلز */}
            </div>
          </div>
          <div className="StatisticsList-main">
            <div className="StatisticsList-info">
              <p className="StatisticsList-number">{Data.orders}</p>
              <p className="StatisticsList-name">اوردر</p>
            </div>
            <div className="StatisticsList-icon">
              <i className="fa fa-cogs"></i> {/* أيقونة الأوردر */}
            </div>
          </div>
          <div className="StatisticsList-main">
            <div className="StatisticsList-info">
              <p className="StatisticsList-number">{Data.chefs}</p>
              <p className="StatisticsList-name">شيف</p>
            </div>
            <div className="StatisticsList-icon">
              <i className="fa fa-cutlery"></i> {/* أيقونة الشيف */}
            </div>
          </div>
          <div className="StatisticsList-main">
            <div className="StatisticsList-info">
              <p className="StatisticsList-number">{Data.deliveries}</p>
              <p className="StatisticsList-name">ديليفري</p>
            </div>
            <div className="StatisticsList-icon">
              <i className="fa fa-truck"></i> {/* أيقونة الديليفري */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatisticsList;
