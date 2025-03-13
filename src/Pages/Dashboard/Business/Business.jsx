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
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchId, setSearchId] = useState(""); // State for search input
  const [filteredOrders, setFilteredOrders] = useState([]); // State for filtered orders

  const BUSINESS_API_ENDPOINT = "https://management.mlmcosmo.com/api/business";
  const DELIVERIES_API_ENDPOINT =
    "https://management.mlmcosmo.com/api/deliveries";

  useEffect(() => {
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
    handleGetReport();
  }, [token]);

  useEffect(() => {
    if (businessData && businessData.orders) {
      const filtered = businessData.orders.filter((order) =>
        String(order.id).includes(searchId)
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders([]);
    }
  }, [businessData, searchId]);

  const handleGetReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};

      if (fromDate) {
        params.from = moment(fromDate).format("YYYY-MM-DD");
      }
      if (toDate) {
        params.to = moment(toDate).format("YYYY-MM-DD");
      }
      if (selectedDelivery) {
        params.delivery_id = selectedDelivery;
      }

      const response = await axios.get(BUSINESS_API_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` },
        params: params,
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

  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSearchChange = (event) => {
    setSearchId(event.target.value);
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
    const value = businessData[field];
    return value === null ? "Not Found" : value;
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

  const renderOrderDetail = (label, value) => {
    const displayValue = value === null ? "Not Found" : value;
    return (
      <tr>
        <th
          style={{
            width: "30%",
            textAlign: "center",
            backgroundColor: "#f2f2f2",
          }}
        >
          {label}
        </th>
        <td style={{ width: "70%" }}>{displayValue}</td>
      </tr>
    );
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
                      .filter((key) => key !== "orders")
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
                {/* Search Input */}
                <div className="mb-3">
                  <label htmlFor="searchId" className="form-label">
                    Search by Order ID:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="searchId"
                    placeholder="Enter Order ID"
                    value={searchId}
                    onChange={handleSearchChange}
                  />
                </div>
                <table className="table table-striped text-center">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Total Price</th>
                      <th>Deposit</th>
                      <th>Remaining</th>
                      <th>Type</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => {
                        const remaining = order.total_price - order.deposit;

                        return (
                          <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.total_price}</td>
                            <td>{order.deposit}</td>
                            <td>{remaining || "N/A"}</td>
                            <td>{order.payment_method}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() => handleShowDetails(order)}
                              >
                                Show Details
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
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

      {/* Bootstrap Modal */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Order Details</h5>
            </div>
            <div className="modal-body">
              {selectedOrder && (
                <table
                  className="table table-bordered"
                  style={{ width: "100%", fontSize: "14px" }}
                >
                  <tbody style={{ wordBreak: "break-word" }}>
                    {renderOrderDetail("Order ID", selectedOrder.id)}
                    {renderOrderDetail(
                      "Order Details",
                      selectedOrder.order_details
                    )}
                    <tr>
                      <th
                        style={{
                          width: "30%",
                          textAlign: "center",
                          backgroundColor: "#f2f2f2",
                        }}
                      >
                        Image
                      </th>
                      <td style={{ width: "70%" }}>
                        {selectedOrder.image ? (
                          <img
                            src={selectedOrder.image}
                            alt="Order"
                            style={{ maxWidth: "100px", maxHeight: "100px" }}
                          />
                        ) : (
                          "Not Found"
                        )}
                      </td>
                    </tr>
                    {renderOrderDetail(
                      "Description",
                      selectedOrder.description
                    )}
                    {renderOrderDetail(
                      "Is Sameday",
                      selectedOrder.is_sameday ? "Yes" : "No"
                    )}
                    {renderOrderDetail("From", selectedOrder.from)}
                    {renderOrderDetail("To", selectedOrder.to)}
                    {renderOrderDetail(
                      "Delivery Date",
                      selectedOrder.delivery_date
                    )}
                    {renderOrderDetail("Order Type", selectedOrder.order_type)}
                    {renderOrderDetail("Cake Price", selectedOrder.cake_price)}
                    {renderOrderDetail(
                      "Flower Price",
                      selectedOrder.flower_price
                    )}
                    {renderOrderDetail(
                      "Delivery Price",
                      selectedOrder.delivery_price
                    )}
                    {renderOrderDetail("Deposit", selectedOrder.deposit)}
                    {renderOrderDetail(
                      "Total Price",
                      selectedOrder.total_price
                    )}
                    {renderOrderDetail(
                      "Customer Name",
                      selectedOrder.customer_name
                    )}
                    {renderOrderDetail(
                      "Customer Phone",
                      selectedOrder.customer_phone
                    )}
                    {renderOrderDetail(
                      "Additional Data",
                      selectedOrder.additional_data
                    )}
                    {renderOrderDetail("Branch ID", selectedOrder.branch_id)}
                    {renderOrderDetail(
                      "Is Returned",
                      selectedOrder.is_returned ? "Yes" : "No"
                    )}
                    {renderOrderDetail("Problem", selectedOrder.problem)}
                    {renderOrderDetail(
                      "Rejection Cause",
                      selectedOrder.rejection_cause
                    )}
                    {renderOrderDetail("Status", selectedOrder.status)}
                    {renderOrderDetail(
                      "Is Completed",
                      selectedOrder.is_completed ? "Yes" : "No"
                    )}
                    {renderOrderDetail(
                      "Payment Method",
                      selectedOrder.payment_method
                    )}
                    {renderOrderDetail("Sale ID", selectedOrder.sale_id)}
                    {renderOrderDetail("Manager ID", selectedOrder.manager_id)}
                    {renderOrderDetail("Created At", selectedOrder.created_at)}
                    {renderOrderDetail("Updated At", selectedOrder.updated_at)}
                  </tbody>
                </table>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {showModal && <div className="modal-backdrop fade show"></div>}
    </section>
  );
}
