import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

function PaymentReports() {
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const [DeliveryData, setDeliveryData] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isChecked, setIsChecked] = useState(false); // State for the checkbox

  const DELIVERY_API_ENDPOINT =
    "https://management.mlmcosmo.com/api/all-deliveries";
  const REPORT_API_ENDPOINT =
    "https://management.mlmcosmo.com/api/reports/delivery-summary";
  const MARK_COMPLETED_API_ENDPOINT =
    "https://management.mlmcosmo.com/api/reports/mark-delivery-completed"; // New endpoint

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axios.get(DELIVERY_API_ENDPOINT, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDeliveryData(response.data);
      } catch (error) {
        setError("Failed to fetch delivery list");
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to fetch delivery list!",
        });
      }
    };

    fetchDeliveries();
  }, [token]);

  const handleDeliveryChange = (event) => {
    setSelectedDelivery(event.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = async () => {
    if (!selectedDelivery || !selectedDate) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please select a delivery and a date!",
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
      const url = `${REPORT_API_ENDPOINT}?delivery_id=${selectedDelivery}&date=${formattedDate}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      setReportData(data);
      setIsChecked(data["is completed"] === 1); // Set isChecked based on "is completed"
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Report data fetched successfully!",
      });
    } catch (error) {
      setError("Failed to fetch report data");
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to fetch report data!",
      });
    } finally {
      setLoading(false);
    }
  };

  const getFieldLabel = (field) => {
    switch (field) {
      case "date":
        return "Delivery Date";
      case "delivery_id": {
        // Find the delivery name based on the ID
        const delivery = DeliveryData.find(
          (d) => d.id === reportData.delivery_id
        );
        return delivery ? `Delivery Name` : "Delivery ID"; // Return "Delivery ID" as a fallback
      }
      case "total":
        return "Total Revenue";
      case "cakes":
        return "Cakes Revenue";
      case "flowers":
        return "Flowers Revenue";
      case "net_amount":
        return "Net Amount";
      case "orders_count":
        return "Orders Count";
      default:
        return field;
    }
  };

  const getFieldValue = (field) => {
    if (field === "delivery_id") {
      // Find the delivery name based on the ID
      const delivery = DeliveryData.find(
        (d) => d.id === reportData.delivery_id
      );
      return delivery ? delivery.name : reportData.delivery_id; // Return delivery name if found, otherwise return the ID
    }
    return reportData[field];
  };

  const cardVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const handleCheckboxChange = async (event) => {
    setIsChecked(event.target.checked);
    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");

    try {
      const response = await axios.post(
        MARK_COMPLETED_API_ENDPOINT,
        null, // No request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            delivery_id: selectedDelivery,
            date: formattedDate,
          },
        }
      );

      console.log("Mark completed API response:", response.data);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Delivery status updated successfully!",
      });
    } catch (error) {
      console.error("Failed to mark delivery as completed:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to mark delivery as completed!",
      });
    }
  };

  return (
    <>
      <section className="mt-5">
        <div className="container">
          <div className="card shadow">
            <div className="card-header">
              <h4 className="mb-0">Payment Reports</h4>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mb-3">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="deliverySelect" className="form-label">
                      Select Delivery:
                    </label>
                    <select
                      className="form-select"
                      id="deliverySelect"
                      value={selectedDelivery}
                      onChange={handleDeliveryChange}
                      aria-label="Select Delivery"
                      disabled={loading}
                    >
                      <option value="">-- Select Delivery --</option>
                      {DeliveryData.map((ele) => (
                        <option key={ele.id} value={ele.id}>
                          {ele.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3  d-flex align-items-center justify-content-center">
                    <label htmlFor="datePicker" className="form-label mx-2">
                      Select Date:
                    </label>
                    <DatePicker
                      id="datePicker"
                      selected={selectedDate}
                      onChange={handleDateChange}
                      dateFormat="yyyy-MM-dd"
                      className="form-control"
                      placeholderText="Select a date"
                      disabled={loading}
                    />
                  </div>
                </div>
                <button
                  style={{
                    backgroundColor: "rgba(169, 65, 29, 1)",
                    color: "white",
                  }}
                  className="btn"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Loading...
                    </>
                  ) : (
                    "Get Report"
                  )}
                </button>
              </div>
            </div>
          </div>

          {reportData && (
            <motion.div
              className="mt-3"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="card shadow">
                <div className="card-body">
                  <h5 className="card-title">Report Data:</h5>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Field</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(reportData)
                        .filter(([key, value]) => key !== "is completed")
                        .map(([key, value]) => (
                          <tr key={key}>
                            <td>{getFieldLabel(key)}</td>
                            <td>{getFieldValue(key)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="reportCheckbox"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                      disabled={loading} // Disable the checkbox while loading
                    />
                    <label
                      className="form-check-label"
                      htmlFor="reportCheckbox"
                    >
                      Mark as Completed
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}

export default PaymentReports;
