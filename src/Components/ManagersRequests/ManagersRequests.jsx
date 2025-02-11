import { useEffect, useState } from "react";
import "../../Style/ManagersRequests/ManagersRequests.css";
import axios from "axios";

function ManagersRequests() {
  const [requests, setRequests] = useState({
    sales: 0,
    managers: 0,
  });
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://management.mlmcosmo.com/api/requests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRequests({
          sales: response.data.sales,
          managers: response.data.managers,
        });
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      console.warn("No AuthToken found in localStorage.");
      setLoading(false); // Ensure loading is set to false even if no token.
    }
  }, [token]);

  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading indicator
  }

  return (
    <>
      <h3
        style={{
          fontSize: "12px",
          fontWeight: "600",
          color: "rgba(0, 0, 0, 1)",
          fontFamily: "cairo",
          textAlign: "right",
          marginBottom: "10px",
        }}
      >
        المديرين
      </h3>
      <div className="requests shadow">
        <div className="requests-parent">
          <div className="requests-sub-parent">
            <p className="requests-number">{requests.sales}</p>
            <h4 className="requests-title">سليز جديد</h4>
          </div>
          <div className="requests-icon">
            <i className="fa fa-user-plus"></i> {/* Request Addition Icon */}
          </div>
        </div>
        <div className="requests-parent">
          <div className="requests-sub-parent">
            <p className="requests-number">{requests.managers}</p>
            <h4 className="requests-title">مدير جديد</h4>
          </div>
          <div
            className="requests-icon"
            style={{ backgroundColor: "rgba(255, 219, 166, 1)" }}
          >
            <i className="fa fa-user"></i> {/* New Manager Icon */}
          </div>
        </div>
      </div>
    </>
  );
}

export default ManagersRequests;
