import React, { useEffect, useState } from "react";
import "../../../Style/Managers.jsx/Managers.css";
import axios from "axios";
import Loader from "../Loader/Loader";
import eye from "../../../Assets/eye.svg";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function DeliveredOrders() {
  const [Data, setData] = useState([]); // Set initial state to empty array
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [initialLoad, setInitialLoad] = useState(true); // Track initial load

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = {};
        if (fromDate && toDate) {
          params.from = fromDate;
          params.to = toDate;
        }
        const response = await axios.get(
          "https://management.mlmcosmo.com/api/delivered-orders",
          {
            headers: { Authorization: `Bearer ${token}` },
            params: params,
          }
        );
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching delivered orders:", error);
        setData([]);
        setLoading(false);
      }
    };

    fetchData();
    setInitialLoad(false); // Set initialLoad to false after first load
  }, [token, fromDate, toDate]); // Run useEffect when token, fromDate, or toDate change

  const totalPages = Math.ceil(Data.length / itemsPerPage) || 1;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Data.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <>
      <section>
        <div className="container">
          <div className="row">
            <div className="col-xl-12 mt-5 d-flex align-items-center justify-content-between">
              <h1 className="Managers-title text-start">Delivered Orders</h1>
              <div className="d-flex align-items-center">
                <div className="mx-2">
                  <label htmlFor="fromDate">From:</label>
                  <input
                    type="date"
                    id="fromDate"
                    className="form-control form-control-sm"
                    value={fromDate}
                    onChange={(e) => {
                      setCurrentPage(1);
                      setFromDate(e.target.value);
                    }}
                  />
                </div>
                <div className="mx-2">
                  <label htmlFor="toDate">To:</label>
                  <input
                    type="date"
                    id="toDate"
                    className="form-control form-control-sm"
                    value={toDate}
                    onChange={(e) => {
                      setCurrentPage(1);
                      setToDate(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="container Managers-table-container vh-100">
              <div className="row Managers-table-row">
                <div className="col-12 Managers-table-col mt-5">
                  <table className="table Managers-table table-hover shadow">
                    <thead>
                      <tr>
                        <th scope="col">Order ID</th>
                        <th scope="col">Order Type</th>
                        <th scope="col">delivery date</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length === 0 ? (
                        <>
                          <tr>
                            <td colSpan="12" className="text-center">
                              No delivered orders currently
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
                              <td>{order.order_type}</td>
                              <td>{order.delivery_date}</td>
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

export default DeliveredOrders;
