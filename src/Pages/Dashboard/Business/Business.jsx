import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

export default function Business() {
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deliveries, setDeliveries] = useState([]); // State for delivery persons
  const [selectedDelivery, setSelectedDelivery] = useState(""); // State for selected delivery person
  const [fromDate, setFromDate] = useState(null); // State for "From" date
  const [toDate, setToDate] = useState(null); // State for "To" date

  const BUSINESS_API_ENDPOINT = "https://management.mlmcosmo.com/api/business";
  const DELIVERIES_API_ENDPOINT =
    "https://management.mlmcosmo.com/api/deliveries";

  useEffect(() => {
    const fetchBusinessData = async () => {
      // No initial fetch, data will be fetched on button click
    };

    const fetchDeliveries = async () => {
      try {
        const response = await axios.get(DELIVERIES_API_ENDPOINT, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDeliveries(response.data);
      } catch (error) {
        console.error("Failed to fetch deliveries:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to fetch delivery list!",
        });
      }
    };

    fetchDeliveries();
    fetchBusinessData(); // Fetch deliveries on component mount
  }, [token]);

  const handleGetReport = async () => {
    if (!fromDate || !toDate) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please select both 'From' and 'To' dates!",
      });
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Format dates to 'YYYY-MM-DD'
      const formattedFromDate = moment(fromDate).format("YYYY-MM-DD");
      const formattedToDate = moment(toDate).format("YYYY-MM-DD");

      // Prepare query parameters
      const params = {
        from: formattedFromDate,
        to: formattedToDate,
        delivery_id: selectedDelivery, // Use selectedDelivery state here
      };

      const response = await axios.get(BUSINESS_API_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` },
        params: params, // Send query parameters
      });
      setBusinessData(response.data);
      console.log("Business Data:", response.data);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Business data fetched successfully!",
      });
    } catch (error) {
      setError("Failed to fetch business data");
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to fetch business data!",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeliveryChange = (event) => {
    setSelectedDelivery(event.target.value);
  };

  const handleFromDateChange = (date) => {
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
  };
  const getFieldLabel = (field) => {
    switch (field) {
      case "from":
        return "From";
      case "to":
        return "To";
      case "delivery_id":
        return "Delivery ID";
      case "delivery_name":
        return "Delivery Name";
      case "total":
        return "Total Revenue";
      case "cakes":
        return "Cakes Revenue";
      case "flowers":
        return "Flowers Revenue";
      case "Delivery":
        return "Delivery Revenue";
      case "Cash":
        return "Cash Payments";
      case "Visa":
        return "Visa Payments";
      case "orders_count":
        return "Orders Count";
      default:
        return field;
    }
  };

  const getFieldValue = (field) => {
    if (!businessData) return null;
    return businessData[field] || "N/A";
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="mt-5">
      <div className="container">
        <div className="card shadow">
          <div className="card-header">
            <h4 className="mb-0">Business Data</h4>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row mb-3">
              <div className="col-md-4">
                <label htmlFor="fromDate" className="form-label">
                  From Date:
                </label>
                <DatePicker
                  id="fromDate"
                  selected={fromDate}
                  onChange={handleFromDateChange}
                  dateFormat="yyyy-MM-dd"
                  className="form-control"
                  placeholderText="Select from date"
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="toDate" className="form-label">
                  To Date:
                </label>
                <DatePicker
                  id="toDate"
                  selected={toDate}
                  onChange={handleToDateChange}
                  dateFormat="yyyy-MM-dd"
                  className="form-control"
                  placeholderText="Select to date"
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="deliverySelect" className="form-label">
                  Select Delivery:
                </label>
                <select
                  className="form-select"
                  id="deliverySelect"
                  value={selectedDelivery}
                  onChange={handleDeliveryChange}
                  aria-label="Select Delivery"
                >
                  <option value="">-- All Deliveries --</option>
                  {deliveries.map((delivery) => (
                    <option key={delivery.id} value={delivery.id}>
                      {delivery.first_name} {delivery.last_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              style={{
                backgroundColor: "rgba(169, 65, 29, 1)",
                color: "white",
              }}
              className="btn"
              onClick={handleGetReport}
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

            {loading ? (
              <div className="text-center mt-3">
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                Loading...
              </div>
            ) : businessData ? (
              <motion.div
                className="mt-3"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
              >
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Field</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(businessData)
                      .filter((key) => key !== "orders") // Exclude orders from main table
                      .map((key) => (
                        <tr key={key}>
                          <td>{getFieldLabel(key)}</td>
                          <td>{getFieldValue(key)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </motion.div>
            ) : (
              <div className="alert alert-info mt-3">
                No business data available.
              </div>
            )}
          </div>
        </div>

        {/* Orders Table */}
        {businessData && businessData.orders && (
          <motion.div
            className="mt-3"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="card shadow">
              <div className="card-body">
                <h5 className="card-title">Orders Data:</h5>
                <table className="table table-striped text-center">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Order Details</th>
                      <th>Customer Name</th>
                      <th>Total Price</th>
                      <th>Payment Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {businessData.orders.length > 0 ? (
                      businessData.orders.map((order) => (
                        <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>{order.order_details}</td>
                          <td>{order.customer_name}</td>
                          <td>{order.total_price}</td>
                          <td>{order.payment_method}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
