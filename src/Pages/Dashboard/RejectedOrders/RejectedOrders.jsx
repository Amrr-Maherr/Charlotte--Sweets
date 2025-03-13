import React, { useEffect, useState } from "react";
import "../../../Style/Managers.jsx/Managers.css";
import axios from "axios";
import Loader from "../Loader/Loader";
import eye from "../../../Assets/eye.svg";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

function RejectedOrders() {
  const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedDate, setSelectedDate] = useState(null); // State for selected date
  const [filteredData, setFilteredData] = useState([]); // State for filtered data

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://management.mlmcosmo.com/api/rejected-orders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(response.data);
        setFilteredData(response.data); // Initialize filtered data with all data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rejected orders:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    // Function to filter data based on rejection date
    const filterData = () => {
      let filtered = Data;

      // Filter by rejection date if a date is selected
      if (selectedDate) {
        const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
        filtered = filtered.filter((order) => {
          return (
            order.delivery_date && order.delivery_date.includes(formattedDate)
          );
        });
      }

      setFilteredData(filtered);
      setCurrentPage(1); // Reset to the first page after filtering
    };

    filterData();
  }, [Data, selectedDate]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Navigate between pages
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <>
      <section>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="container Managers-table-container vh-100">
              <div className="row Managers-table-row d-flex align-items-center">
                <div className="col-6 mt-5">
                  <h1 className="Managers-title text-start">Rejected Orders</h1>
                </div>
                <div className="col-6 mt-3">
                  <label htmlFor="rejectionDateSearch" className="form-label">
                    Search by Rejection Date:
                  </label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    className="form-control"
                    placeholderText="Select rejection date"
                  />
                </div>
              </div>
              <div className="row Managers-table-row">
                <div className="col-12 Managers-table-col mt-5">
                  <table className="table Managers-table table-hover shadow">
                    <thead>
                      <tr>
                        <th scope="col">Order ID</th>
                        <th scope="col">Order type</th>
                        <th scope="col">Delivery date</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length === 0 ? (
                        <>
                          <tr>
                            <td colSpan="12" className="text-center">
                              No rejected orders currently match your search
                            </td>
                          </tr>
                        </>
                      ) : (
                        <>
                          {currentItems.map((order, index) => (
                            <motion.tr
                              initial={{ opacity: 0, y: 50 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 100,
                                damping: 25,
                                delay: 0.1 * index,
                              }}
                              key={order.id}
                            >
                              <td>{order.id}</td>
                              <td>{order.order_type || "No order type"}</td>
                              <td>{order.delivery_date || "No order type"}</td>
                              <td className="actions">
                                <Link
                                  to={`/dashboard/order-details/${order.id}`}
                                  className="action-icon view-icon"
                                >
                                  <div className="action-icon">
                                    <img src={eye} alt="View" />
                                  </div>
                                </Link>
                              </td>
                            </motion.tr>
                          ))}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              <div className="d-flex justify-content-center">
                <button
                  style={{
                    backgroundColor: "rgba(169, 65, 29, 1)",
                    color: "white",
                  }}
                  className="btn mx-2"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="align-self-center">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn mx-2"
                  style={{
                    backgroundColor: "rgba(169, 65, 29, 1)",
                    color: "white",
                  }}
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}

export default RejectedOrders;
