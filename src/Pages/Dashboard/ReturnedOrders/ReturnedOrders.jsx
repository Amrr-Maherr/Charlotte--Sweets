import React, { useEffect, useState } from "react";
import "../../../Style/Managers.jsx/Managers.css"; // Use the same CSS
import axios from "axios";
import Loader from "../Loader/Loader";
import eye from "../../../Assets/eye.svg"; // Or a suitable icon
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function ReturnedOrders() {
  const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://management.mlmcosmo.com/api/returned-orders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching returned orders:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // Calculate the number of pages
  const totalPages = Math.ceil(Data.length / itemsPerPage);

  // Extract items for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Data.slice(indexOfFirstItem, indexOfLastItem);

  // Navigate between pages
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <>
      <section>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="container Managers-table-container vh-100">
              {" "}
              {/* Use the same Class */}
              <div className="row Managers-table-row">
                <div className="col-xl-12 mt-5">
                  <h1 className="Managers-title text-start">Returned Orders</h1>{" "}
                  {/* Appropriate title */}
                </div>
              </div>
              <div className="row Managers-table-row">
                <div className="col-12 Managers-table-col mt-5">
                  <table className="table Managers-table table-hover shadow">
                    {" "}
                    {/* Use the same Classes */}
                    <thead>
                      <tr>
                        <th scope="col">Order ID</th>
                        <th scope="col">Order type</th> {/* Example column */}
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length === 0 ? (
                        <>
                          <tr>
                            <td colSpan="3" className="text-center">
                              No returned orders currently
                            </td>
                          </tr>
                        </>
                      ) : (
                        <>
                          {currentItems.map((order, index) => (
                            <motion.tr // Use motion.tr here
                              initial={{ opacity: 0, y: 50 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 100,
                                damping: 25,
                                delay: 0.1 * index,
                              }} // Bounce motion with delay based on row order
                              key={order.id}
                            >
                              {/* Modify here based on API fields */}
                              <td>{order.id}</td>
                              <td>
                                {order.Order_type || "Not specified"}
                              </td>{" "}
                              <td className="actions">
                                <Link
                                  to={`/dashboard/order-details/${order.id}`} // Suitable link
                                  className="action-icon view-icon"
                                >
                                  <div className="action-icon">
                                    <img src={eye} alt="View" />
                                  </div>
                                </Link>
                              </td>
                            </motion.tr> // And close motion.tr here
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

export default ReturnedOrders;
