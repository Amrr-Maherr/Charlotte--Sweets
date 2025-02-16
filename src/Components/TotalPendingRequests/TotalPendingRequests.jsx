import { useEffect, useState } from "react";
import "../../Style/TotalPendingRequests/TotalPendingRequests.css";
import axios from "axios";
import "font-awesome/css/font-awesome.min.css"; // Import Font Awesome CSS

function TotalPendingRequests() {
  const [Data, setData] = useState({ sales: 0, managers: 0 }); // Initialize with default values
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const API_ENDPOINT = "https://management.mlmcosmo.com/api/requests"; // Replace with your actual API endpoint

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_ENDPOINT, {
          headers: {
            Authorization: `Bearer ${token}`, // Adjust if your API uses a different authentication scheme
          },
        });
        setData(response.data);
        console.log("API Response:", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // You might want to reset the data to default values in case of error
        // setData({ sales: 0, managers: 0 });  // Reset data on error.  Optional.
        if (error.response) {
          console.error("Response Data:", error.response.data);
          console.error("Response Status:", error.response.status);
          console.error("Response Headers:", error.response.headers);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error setting up the request:", error.message);
        }
      }
    };

    if (token) {
      fetchData();
    } else {
      console.warn("AuthToken not found in localStorage. Not fetching data.");
    }
  }, [token]);

  return (
    <>
      <div className="TotalPendingRequests-title">
        <h3>Total Requests</h3>
      </div>
      <div className="TotalPendingRequests-main-parent shadow">
        <div className="TotalPendingRequests-parent">
          <div className="TotalPendingRequests-child">
            <div className="TotalPendingRequests-info">
              <div className="number">
                {/* Display the sales count here */}
                {Data.sales !== undefined ? Data.sales : "Loading..."}
              </div>
              <div className="title">Sales</div>
            </div>
            <div
              className="TotalPendingRequests-icon"
              style={{
                backgroundColor: "rgba(232, 234, 255, 1)",
                color: "rgba(46, 170, 187, 1)",
              }}
            >
              <i className="fa fa-money" aria-hidden="true"></i>{" "}
              {/* Sales Icon */}
            </div>
          </div>

          <div className="TotalPendingRequests-child">
            <div className="TotalPendingRequests-info">
              <div className="number">
                {/* Display the managers count here */}
                {Data.managers !== undefined ? Data.managers : "Loading..."}
              </div>
              <div className="title">Managers</div>
            </div>
            <div
              className="TotalPendingRequests-icon"
              style={{
                backgroundColor: "rgba(255, 219, 166, 1)",
                color: "rgba(236, 142, 0, 1)",
              }}
            >
              <i className="fa fa-users" aria-hidden="true"></i>{" "}
              {/* Managers Icon */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TotalPendingRequests;
