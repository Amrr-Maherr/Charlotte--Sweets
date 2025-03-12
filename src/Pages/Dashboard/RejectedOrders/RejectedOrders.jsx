import React, { useEffect, useState } from "react";
import "../../../Style/Managers.jsx/Managers.css";
import axios from "axios";
import Loader from "../Loader/Loader";
import eye from "../../../Assets/eye.svg";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function RejectedOrders() {
  const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState(""); // State for Order Type search
  const [filteredData, setFilteredData] = useState([]); // State for filtered data

  useEffect(() => {
    const fetchData = async () => {
      try {
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
    // Function to filter data based on Order Type
    const filterData = () => {
      let filtered = Data;

      // Filter by Order Type if a search term is entered
      if (searchTerm) {
        filtered = filtered.filter((order) => {
          return (
            order.order_type &&
            order.order_type.toLowerCase().includes(searchTerm.toLowerCase())
          );
        });
      }

      setFilteredData(filtered);
      setCurrentPage(1); // Reset to the first page after filtering
    };

    filterData();
  }, [Data, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Navigate between pages
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by order type..."
                    value={searchTerm}
                    onChange={handleSearchChange}
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
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length === 0 ? (
                        <>
                          <tr>
                            <td colSpan="3" className="text-center">
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
