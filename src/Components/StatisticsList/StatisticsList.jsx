import axios from "axios";
import { useEffect, useState } from "react";
import "../../Style/StatisticsList/StatisticsList.css";
import "font-awesome/css/font-awesome.min.css"; // تأكد من استيراد Font Awesome

function StatisticsList() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const token = localStorage.getItem("AuthToken")
    ? JSON.parse(localStorage.getItem("AuthToken"))
    : null;

  useEffect(() => {
    if (!token) {
      console.log("No token found");
      setLoading(false);
      return;
    }

    axios
      .get("https://management.mlmcosmo.com/api/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error.message
        );
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <p>Error loading statistics.</p>;
  }

  const iconMap = {
    branches: "fa-building",
    managers: "fa-user", 
    sales: "fa-bar-chart", 
    orders: "fa-shopping-cart",
    chefs: "fa-cutlery", 
    deliveries: "fa-truck",
  };

  return (
    <>
      <div className="main-parent-title "style={{width:"397px",margin:"0px auto"}}>
        <h2 style={{fontSize:"20px",fontWeight:"700"}}>Statistics</h2>
      </div>
      <div className="main-parent shadow mx-auto">
        <div className="child-parent">
          {Object.entries(data).map(([key, value]) => (
            <div className="child" key={key}>
              <div className="child-title">
                <p className="child-number">{value}</p>
                <p className="child-text">{key}</p>
              </div>
              <div className="child-icon">
                <i className={`fa ${iconMap[key] || "fa-info-circle"}`}></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default StatisticsList;
